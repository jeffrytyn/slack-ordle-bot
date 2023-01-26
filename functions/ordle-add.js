import db from "../firebase.mjs"
import {setDoc, doc, increment, getDoc } from "firebase/firestore";
import qs from "qs";
import slack_verify from "../slack_verify.js";
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

async function test(){
    const updates = [
      setDoc(doc(db, "test", "test"), {
        total: increment(5)
      }, {merge: true})
    ]
    return;
}

test()

export async function handler({body, headers}, context){
  if(!slack_verify(headers["x-slack-request-timestamp"], body, headers["x-slack-signature"])){
    console.log("not slack request");
    return {statusCode: 401, body: "Unauthorized"}
  }
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
        text: `${game.charAt(0).toUpperCase() + game.slice(1)} ${day} has already been submitted.`
      })
    }
  }else{
    await Promise.all([
      setDoc(doc(db, game, user_id), {
        total: increment(score)
      }, {merge: true}),
      setDoc(date_ref, {
        score: score
      })
    ])
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        response_type: "in_channel",
        text: `${game.charAt(0).toUpperCase() + game.slice(1)} ${day} score: ${score}`
      })
    }
  }
};