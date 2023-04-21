import {db} from "../firebase.js"
import {setDoc, doc, increment, getDoc, runTransaction } from "firebase/firestore";
import fetch from 'node-fetch'
import slack_verify from "../slack_verify.js";
import {GAME_INFO, is_valid_day} from "../game_parsers.js";

const parse_text = (text) => {
  for(const [game, info] of Object.entries(GAME_INFO)){
    let [day, score] = info.parser(text);
    if(score !== -1) return [game, day, score];
  }
  return ["", "", -1];
}

async function add_score(game, day, score, user_id){
  const exists = await runTransaction(db, async (t) => {
    const date_ref = doc(db, game, user_id, "scores", day);
    const user_ref = doc(db, game, user_id);
    const date_doc = await t.get(date_ref);
    if(date_doc.exists()){
      return true;
    }
    t.set(date_ref, {
      score: score
    });
    t.update(user_ref, {
      total: increment(score)
    }, {merge: true});
    return false;
  });
  return !exists;
}

async function event_handler(body, headers){
  if(!slack_verify(headers["x-slack-request-timestamp"], body, headers["x-slack-signature"])){
    console.log("not slack request");
    return {statusCode: 401, body: "Unauthorized"}
  }
  const body_obj = JSON.parse(body) || {};
  // console.log(body_obj.event)
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
  const {res, valid_day} = is_valid_day(game, day);
  if(!res){
    await fetch("https://slack.com/api/chat.postEphemeral", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.SLACK_APP_TOKEN}`
      },
      body: JSON.stringify({
        channel: body_obj.event.channel,
        user: user_id,
        text: `${game.charAt(0).toUpperCase() + game.slice(1)} day must be ${valid_day-1}, ${valid_day} or ${valid_day+1}.`
      })
    })
    return {statusCode: 200}
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

