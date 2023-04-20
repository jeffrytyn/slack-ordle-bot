import {db} from "../firebase.js"
import { writeBatch, collection, getDocs } from "firebase/firestore"; 
import { SUPPORTED_GAMES } from "../game_parsers.js";
import { schedule } from "@netlify/functions";


async function reset_score(){
  for(const game of SUPPORTED_GAMES){
    const batch = writeBatch(db);
    const snap = await getDocs(collection(db, game));
    for(const doc of snap.docs){
      batch.update(doc.ref, {total: 0});
    }
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