import {db} from "../firebase.js"
import {setDoc, doc, increment, getDoc } from "firebase/firestore";
import fetch from 'node-fetch'
import slack_verify from "../slack_verify.js";
import {   
  get_wordle_score,
  get_worldle_score,
  get_quordle_score,
  get_countryle_score } from "../game_parsers.js";

const parse_text = (text) => {
  let [day, score] = get_wordle_score(text);
  if(score !== -1) return ["wordle", day, score];
  [day, score] = get_worldle_score(text);
  if(score !== -1) return ["worldle", day, score];
  [day, score] = get_quordle_score(text);
  if(score !== -1) return ["quordle", day, score];
  [day, score] = get_countryle_score(text);
  if(score !== -1) return ["countryle", day, score];
  return ["", "", -1];
}

console.log(parse_text("Wordle 597 has already been submitted."))

async function add_score(game, day, score, user_id){
  const date_ref = doc(db, game, user_id, "scores", day);
  const date_doc = await getDoc(date_ref);
  if(date_doc.exists()){
    return false;
  }else{
    await Promise.all([
      setDoc(doc(db, game, user_id), {
        total: increment(score)
      }, {merge: true}),
      setDoc(date_ref, {
        score: score
      })
    ]);
    return true;
  }
}

async function event_handler(body, headers){
  if(!slack_verify(headers["x-slack-request-timestamp"], body, headers["x-slack-signature"])){
    console.log("not slack request");
    return {statusCode: 401, body: "Unauthorized"}
  }
  const body_obj = JSON.parse(body) || {};
  console.log(body_obj.event)
  if(body_obj.event?.type !== "message" || body_obj.event?.subtype || body_obj.event?.bot_id || !body_obj.event?.ts){
    console.log("received non-user message");
    return {statusCode: 200}
  }
  const user_id = body_obj.event.user;
  const text = body_obj.event.text?.toLowerCase().trim() || "";
  if(!user_id || !text){
    return {statusCode: 400, body: "Bad Request"}
  }
  const ts = body_obj.event.ts;
  const channel = body_obj.event.channel;
  const [game, day, score] = parse_text(text);
  if(score === -1){
    return {statusCode: 200};
  }
  const added = await add_score(game, day, score, user_id);
  if(added){
    await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SLACK_APP_TOKEN}`
      },
      body: JSON.stringify({
        channel: channel,
        thread_ts: ts,
        text: `${game.charAt(0).toUpperCase() + game.slice(1)} ${day} score: ${score}`
      })
    })
  }else{
    await fetch("https://slack.com/api/chat.postEphemeral", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SLACK_APP_TOKEN}`
      },
      body: JSON.stringify({
        channel: body_obj.event.channel,
        user: user_id,
        text: `${game.charAt(0).toUpperCase() + game.slice(1)} ${day} has already been submitted.`
      })
    })
  }
  return {statusCode: 200};
}

export async function handler({body, headers}, _){
  return event_handler(body, headers);
};

