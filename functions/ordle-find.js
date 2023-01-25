import db from "../firebase.js"
import { getDoc, doc } from "firebase/firestore";
import qs from "qs";



export async function handler({body}, context){
  const body_obj = qs.parse(body) || {};
  const user_id = body_obj.user_id;
  const text = body_obj.text?.toLowerCase() || "";
  if(text !== "wordle" || text !== "worldle" || text !== "quordle" || text !== "countryle"){
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        response_type: "ephemeral",
        text: "Sorry, that game is not supported. Please try a game that is."
      })}
  }
  const snap = await getDoc(doc(db, text, user_id))
  if(snap.exists()){
    const score = snap.data().score;
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        response_type: "ephemeral",
        text: `Total score for ${text}: ${score}`
      })}
  }else{
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        response_type: "ephemeral",
        text: `No score for ${text} found.`
      })}
  }
};