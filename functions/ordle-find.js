import db from "../firebase.js"
import { setDoc, doc } from "firebase/firestore";
import fetch from 'node-fetch';
import qs from "qs";



export async function handler({body}, context){
  const body_obj = qs.parse(body) || {};
  const user_id = body_obj.user_id;
  const text = body_obj.text?.toLowerCase() || "";
  fetch(body_obj.response_url, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        response_type: "in_channel",
        text: body_obj.command + " " + body_obj.text
      })
    });
  const [game_id, score] = parse_app_mention(text);
  let game_ref; let game;
  if(game_id === -1){
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        response_type: "ephemeral",
        text: "Sorry, that game is not supported. Please try a game that is."
      })}
  }
  if(game_id === 0){
    game = "wordle"
    game_ref = doc(db, game, user_id);
  }else if(game_id === 1){
    game = "worldle"
    game_ref = doc(db, game, user_id);
  }else if(game_id === 2){
    game = "quordle"
    game_ref = doc(db, game, user_id);
  }else if(game_id === 3){
    game = "countryle"
    game_ref = doc(db, game, user_id);
  }
  setDoc(game_ref, {
    score: score
  });
  return {
    statusCode: 200,
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      response_type: "in_channel",
      text: `Your score of ${score} for ${game} has been recorded.`
    })}
};