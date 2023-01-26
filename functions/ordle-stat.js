import {db, auth} from "../firebase.js"
import { collection, doc, getDocFromServer, getCountFromServer } from "firebase/firestore";
import qs from "qs";



export async function handler({body}, context){
  if(!slack_verify(headers["x-slack-request-timestamp"], body, headers["x-slack-signature"])){
    console.log("not slack request");
    return {statusCode: 401, body: "Unauthorized"}
  }
  if(!auth.currentUser){
    console.log("Firebase anonymous sign in");
    await signInAnonymously(auth);
  }
  const body_obj = qs.parse(body) || {};
  const user_id = body_obj.user_id;
  const game = body_obj.text?.toLowerCase().trim() || "";
  if(game !== "wordle" && game !== "worldle" && game !== "quordle" && game !== "countryle"){
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        response_type: "ephemeral",
        text: (game.length === 0) ? "Please enter a game name." : `Sorry, ${game} is not supported. See OrdleBot info for valid games.`
      })}
  }
  const snap = await getDocFromServer(doc(db, game, user_id))
  if(snap.exists()){
    const score = snap.data().total;
    const days = await getCountFromServer(collection(db, game, user_id, "scores"));
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        response_type: "ephemeral",
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              text: `*${game.charAt(0).toUpperCase() + game.slice(1)} Stats*\nTotal score: ${score}\nDays played: ${days.data().count}`
            }
          }
        ]
      })}
  }else{
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        response_type: "ephemeral",
        text: `No score for ${game.charAt(0).toUpperCase() + game.slice(1)} found.`
      })}
  }
};