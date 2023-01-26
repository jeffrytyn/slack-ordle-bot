import db from "../firebase.mjs"
import { collection, orderBy, query, limit, getDocs} from "firebase/firestore";
import qs from "qs";



export async function handler({body}, context){
  if(!slack_verify(headers["x-slack-request-timestamp"], body, headers["x-slack-signature"])){
    console.log("not slack request");
    return {statusCode: 401, body: "Unauthorized"}
  }
  const body_obj = qs.parse(body) || {};
  const [game, count] = body_obj.text?.toLowerCase().split(" ").map(w => w.trim()) || ["", ""];
  
  if(game !== "wordle" && game !== "worldle" && game !== "quordle" && game !== "countryle"){
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        response_type: "ephemeral",
        text: (game.length === 0) ? "Please enter a game name." : `Sorry, ${game} is not supported. See OrdleBot info for valid games.`
      })}
  }
  if(isNaN(count) || isNaN(parseInt(count))){ count = 5;}
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