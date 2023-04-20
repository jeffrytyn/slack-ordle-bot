import {db} from "../firebase.js"
import { SUPPORTED_GAMES } from "../game_parsers.js";
import { schedule } from "@netlify/functions";


async function reset_score(){
  for(const game of SUPPORTED_GAMES){
    const batch = db.batch();
    const snap = await db.collection(game).get();
    snap.forEach(doc => {
      batch.update(doc.ref, {total: 0});
    });
    await batch.commit();
  }
  return {
    statusCode: 200,
  }
}

const handler = schedule("@monthly", reset_score);
export {handler};