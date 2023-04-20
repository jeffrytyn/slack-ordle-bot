import {db} from "../firebase.js"
import { writeBatch, collection, getDocs } from "firebase/firestore"; 
import { SUPPORTED_GAMES } from "../game_parsers.js";
import { schedule } from "@netlify/functions";

const get_past_month_UTC  = () => {
  const month_ind = new Date().getUTCMonth();
  switch(month_ind){
    case 0: return "december";
    case 1: return "january";
    case 2: return "february";
    case 3: return "march";
    case 4: return "april";
    case 5: return "may";
    case 6: return "june";
    case 7: return "july";
    case 8: return "august";
    case 9: return "september";
    case 10: return "october";
    case 11: return "november";
  }
}

const get_year_UTC = () => {
  return new Date().getUTCFullYear();
}


async function reset_score(){
  for(const game of SUPPORTED_GAMES){
    const batch = writeBatch(db);
    const snap = await getDocs(collection(db, game));
    let [max_score, max_user] = [0, ""];
    for(const doc of snap.docs){
      if(doc.data().total > max_score){
        max_score = doc.data().total;
        max_user = doc.id;
      }
      batch.update(doc.ref, {total: 0});
    }
    batch.set(doc(db, game, get_past_month_UTC()), {max_score, max_user, year: get_year_UTC()});
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