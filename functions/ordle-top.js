import {db, auth} from "../firebase.js"
import { collection, orderBy, query, limit, getDocs} from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";
import slack_verify from "../slack_verify.js";
import qs from "qs";



export async function handler({body, headers}, context){
  if(!slack_verify(headers["x-slack-request-timestamp"], body, headers["x-slack-signature"])){
    console.log("not slack request");
    return {statusCode: 401, body: "Unauthorized"}
  }
  if(!auth.currentUser){
    console.log("Firebase anonymous sign in");
    await signInAnonymously(auth);
  }
  const body_obj = qs.parse(body) || {};
  let [game, count] = body_obj.text?.toLowerCase().split(" ").map(w => w.trim()) || ["", ""];
  
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
  const scores = [];
  for(let i = 0; i < snap.docs.length; i++){
    const doc = snap.docs[i];
    scores.push(`${i == 0 ? ":tada: " : ""}<@${doc.id}>: ${doc.data().total}${i == 0 ? " :tada:" : ""}`);
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
            text: `*${game.charAt(0).toUpperCase() + game.slice(1)} Leaderboard*\n${(scores.length > 0) ? scores.join("\n") : "No one bruh play this game"}`
          }
        }
      ]
    })}
};