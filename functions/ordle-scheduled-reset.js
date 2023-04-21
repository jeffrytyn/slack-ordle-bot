import {db} from "../firebase.js"
import { writeBatch, collection, getDocs, where } from "firebase/firestore"; 
import { SUPPORTED_GAMES, get_year_UTC } from "../game_parsers.js";
import { schedule } from "@netlify/functions";

export const get_past_month_UTC  = () => {
  const month_ind = new Date().getUTCMonth();
  return MONTHS[(month_ind+11) % 12];
}

async function reset_score(){
  for(const game of SUPPORTED_GAMES){
    const batch = writeBatch(db);
    const snap = await getDocs(collection(db, game), where("total", ">", 0));
    let [max_score, max_users] = [0, []];
    for(const doc of snap.docs){
      if(doc.data().total > max_score){
        max_score = doc.data().total;
        max_users.push(`<@${doc.id}>`);
      }else if(doc.data().total === max_score){
        max_users.push(`<@${doc.id}>`);
      }
      batch.update(doc.ref, {total: 0});
    }
    const past_month = get_past_month_UTC();
    const year = past_month === MONTHS[11] ? get_year_UTC() - 1 : get_year_UTC();
    if(max_users.length > 0) batch.set(doc(db, game, past_month), {max_score, max_users: max_users.join(", "), year});
    await batch.commit();
  }
  return {
    statusCode: 200,
  }
}
// reset_score();
// console.log("done")
const handler = schedule("@monthly", reset_score);
export {handler};