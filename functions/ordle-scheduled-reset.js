import {db} from "../firebase.js"
import { writeBatch, collection, getDocs, where, query } from "firebase/firestore"; 
import { SUPPORTED_GAMES, get_year_UTC, MONTHS } from "../game_parsers.js";
import { schedule } from "@netlify/functions";

export const get_past_month_UTC  = () => {
  const month_ind = new Date().getUTCMonth();
  return MONTHS[(month_ind+11) % 12];
}

async function reset_score(){
  const past_month = get_past_month_UTC();
  const year = past_month === MONTHS[MONTHS.length-1] ? get_year_UTC() - 1 : get_year_UTC();
  console.log("resetting scores for", past_month, year);
  for(const game of SUPPORTED_GAMES){
    const batch = writeBatch(db);
    const snap = await getDocs(query(collection(db, game), where("total", ">", 0)));
    let [max_score, max_users] = [0, []];
    for(const doc of snap.docs){
      const total = doc.data().total;
      if(total > max_score){
        max_score = total;
        max_users.push(`<@${doc.id}>`);
      }else if(total === max_score){
        max_users.push(`<@${doc.id}>`);
      }
      batch.update(doc.ref, {total: 0});
    }
    if(max_users.length > 0) batch.set(doc(db, game, past_month), {max_score, max_users: max_users.join(", "), year});
    await batch.commit();
    console.log(`reset ${game} scores`);
  }
  return {
    statusCode: 200,
  }
}
// reset_score();
// console.log("done")
const handler = schedule("@monthly", reset_score);
export {handler};