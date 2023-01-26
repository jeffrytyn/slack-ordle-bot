import db from "../firebase.js"
import { collection, orderBy, query, limit, getDocs} from "firebase/firestore";
import qs from "qs";



export async function handler({body}, context){
  const body_obj = qs.parse(body) || {};
  const [game, count] = body_obj.text?.toLowerCase().split(" ") || ["", ""];
  if(game !== "wordle" && game !== "worldle" && game !== "quordle" && game !== "countryle"){
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        response_type: "ephemeral",
        text: "Sorry, that game is not supported. See OrdleBot info for valid games."
      })}
  }
  if(isNaN(count) || isNaN(parseInt(count))){
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        response_type: "ephemeral",
        text: "Input a valid integer to see the leaderboard."
      })}
  }
  const q = query(collection(db, game), orderBy("total", "desc"), limit(parseInt(count)));
  const snap = await getDocs(q);
  const score = [];
  for(const doc of snap.docs){
    score.push(`<@${doc.id}>: ${doc.data().total}`);
  }
  return {
    statusCode: 200,
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      response_type: "in_channel",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${game.charAt(0).toUpperCase() + game.slice(1)} Leaderboard*\n${score.join("\n")}`
          }
        }
      ]
    })}
};