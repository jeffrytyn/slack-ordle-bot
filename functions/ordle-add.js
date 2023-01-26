import db from "../firebase.js"
import {setDoc, doc, increment, addDoc, getDoc } from "firebase/firestore";
import qs from "qs";
import {   
  get_wordle_score,
  get_worldle_score,
  get_quordle_score,
  get_countryle_score } from "../game_parsers.js";


const parse_app_mention = (text) => {
  let [day, score] = get_wordle_score(text);
  if(score >= 0){ return [0, day, score]; }
  [day, score] = get_worldle_score(text);
  if(score >= 0){ return [1, day, score]; }
  [day, score] = get_quordle_score(text);
  if(score >= 0){ return [2, day, score]; }
  [day, score] = get_countryle_score(text);
  if(score >= 0){ return [3, day, score]; }
  return [-1, -1];
}

export async function handler({body}, context){
  const body_obj = qs.parse(body) || {};
  const user_id = body_obj.user_id;
  const text = body_obj.text?.toLowerCase() || "";
  if(!user_id || !text){
    return {statusCode: 400, body: "Bad Request"}
  }
  const [game_id, day, score] = parse_app_mention(text);
  let game;
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
  }else if(game_id === 1){
    game = "worldle"
  }else if(game_id === 2){
    game = "quordle"
  }else if(game_id === 3){
    game = "countryle"
  }
  const date_ref = doc(db, game, user_id, "scores", day);
  const date_doc = await getDoc(date_ref);
  if(date_doc.exists()){
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        response_type: "ephemeral",
        text: `Day ${day} has already been submitted.`
      })
    }
  }else{
    const updates = [
      setDoc(doc(db, game, user_id), {
        total: increment(score)
      }, {merge: true}),
      addDoc(date_ref, {
        score: score
      })
    ]
    await Promise.all(updates);
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        response_type: "in_channel",
        text: `${game.charAt(0) + game.slice(1)} ${day} score: ${score}`
      })
    }
  }
};