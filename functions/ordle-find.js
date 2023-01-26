import db from "../firebase.js"
import { getDoc, doc } from "firebase/firestore";
import qs from "qs";



export async function handler({body}, context){
  const body_obj = qs.parse(body) || {};
  const user_id = body_obj.user_id;
  const game = body_obj.text?.toLowerCase() || "";
  if(game !== "wordle" && game !== "worldle" && game !== "quordle" && game !== "countryle"){
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        response_type: "ephemeral",
        text: "Sorry, that game is not supported. Please try a game that is."
      })}
  }
  const snap = await getDoc(doc(db, game, user_id))
  if(snap.exists()){
    const score = snap.data().total;
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        response_type: "ephemeral",
        text: {
          type: "mrkdwn",
          text: `**${game.charAt(0).toUpperCase() + game.slice(1)} Stats**\nTotal: ${score}\nDays played: 100`
        }
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
  // <@${user_id}>
};