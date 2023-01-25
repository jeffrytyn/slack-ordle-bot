import { initializeApp } from "firebase/app";
import { getFirestore, setDoc, doc } from "firebase/firestore";

import * as dotenv from 'dotenv';
import qs from "qs";
import {   
  get_wordle_score,
  get_worldle_score,
  get_quordle_score,
  get_countryle_score } from "../game_parsers.js";


if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const firebaseConfig = {
  apiKey: process.env.FSTORE_API_KEY,
  authDomain: process.env.FSTORE_AUTH_DOMAIN,
  projectId: process.env.FSTORE_PROJECT_ID,
  storageBucket: process.env.FSTORE_STORAGE_BUCKET,
  messagingSenderId: process.env.FSTORE_MESSAGING_SENDER_ID,
  appId: process.env.FSTORE_APP_ID,
  measurementId: process.env.FSTORE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

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


export async function handler({body}, context){
  const body_obj = qs.parse(body) || {};
  const user_id = body_obj.user_id;
  const text = body_obj.text?.toLowerCase() || "";
  const [game_id, score] = parse_app_mention(text);
  let game_ref;
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
    game_ref = doc(db, "wordle", user_id);
  }else if(game_id === 1){
    game_ref = doc(db, "worldle", user_id);
  }else if(game_id === 2){
    game_ref = doc(db, "quordle", user_id);
  }else if(game_id === 3){
    game_ref = doc(db, "countryle", user_id);
  }
  setDoc(game_ref, {
    score: score
  });
  return {
    statusCode: 200,
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      response_type: "ephemeral",
      text: "Your score of " + score + " has been recorded."
    })}
};