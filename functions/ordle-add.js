import db from "../firebase.js"
import {setDoc, doc } from "firebase/firestore";
import fetch from 'node-fetch';
import qs from "qs";
import {   
  get_wordle_score,
  get_worldle_score,
  get_quordle_score,
  get_countryle_score } from "../game_parsers.js";


const parse_app_mention = (text) => {
  const wordle_score = get_wordle_score(text);
  if(wordle_score >= 0){ return [0, wordle_score]; }
  const worldle_score = get_worldle_score(text);
  if(worldle_score >= 0){ return [1, worldle_score]; }
  const quordle_score = get_quordle_score(text);
  if(quordle_score >= 0){ return [2, quordle_score]; }
  const countryle_score = get_countryle_score(text);
  if(countryle_score >= 0){ return [3, countryle_score]; }
  return [-1, -1];
}

function test(){
  setDoc(doc(db, "wordle", "id"), {
    score: 50
  })
  return;
}

// test()
// console.log("done")
export async function handler({body}, context){
  const body_obj = qs.parse(body) || {};
  const user_id = body_obj.user_id;
  const text = body_obj.text?.toLowerCase() || "";
  if(!user_id || !text){
    return {statusCode: 400, body: "Bad Request"}
  }
  const [game_id, score] = parse_app_mention(text);
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
  console.log(`${game} ${user_id}`);
  setDoc(doc(db, game, user_id), {
    score: score
  }).then(() => {
    console.log("Document successfully written!");
  }).catch((error) => {
    console.error("Error writing document: ", error);
  });
  return {
    statusCode: 200,
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      response_type: "in_channel",
      text: `Your score of ${score} for ${game} has been recorded.`
    })
  }
};