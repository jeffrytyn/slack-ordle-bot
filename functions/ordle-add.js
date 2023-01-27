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
  if(text.startsWith("wordle")){
    const [day, score] = get_wordle_score(text);
    return day !== "" ? ["wordle", day, score] : ["", , "", -1];
  }
  if(text.startsWith("daily quordle")){
    const [day, score] = get_quordle_score(text);
    return day !== "" ? ["quordle", day, score] : ["", , "", -1];
  }
  if(text.startsWith("countryle")){
    const [day, score] = get_countryle_score(text);
    return day !== "" ? ["countryle", day, score] : ["", , "", -1];
  }
  if(text.includes("https://worldle.teuteuf.fr")){
    const [day, score] = get_worldle_score(text);
    return day !== "" ? ["worldle", day, score] : ["", , "", -1];
  }
  return ["", , "", -1];
}

async function add_score(game, day, score, user_id){
  if(game === "" || day === "") return 0;
  const date_ref = doc(db, game, user_id, "scores", day);
  const date_doc = await getDoc(date_ref);
  if(date_doc.exists()){
    return 1;
  }else{
    await Promise.all([
      setDoc(doc(db, game, user_id), {
        total: increment(score)
      }, {merge: true}),
      setDoc(date_ref, {
        score: score
      })
    ]);
    return 2;
  }
}

async function event_handler(body, headers){
  if(!slack_verify(headers["x-slack-request-timestamp"], body, headers["x-slack-signature"])){
    console.log("not slack request");
    return {statusCode: 401, body: "Unauthorized"}
  }
  const body_obj = JSON.parse(body) || {};
  if(body_obj.event?.type !== "message" || body_obj.event?.subtype || body_obj.event?.bot_id || !body_obj.event?.ts){
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
  const added = await add_score(game, day, score, user_id);
  if(added == 1){
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
  }else if(added == 2){
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
  }
  return {statusCode: 200}
}

export async function handler({body, headers}, context){
  return event_handler(body, headers);
};

// export async function handler({body, headers}, context){
//   if(!slack_verify(headers["x-slack-request-timestamp"], body, headers["x-slack-signature"])){
//     console.log("not slack request");
//     return {statusCode: 401, body: "Unauthorized"}
//   }
//   if(!auth.currentUser){
//     console.log("Firebase anonymous sign in");
//     await signInAnonymously(auth);
//   }
//   const body_obj = qs.parse(body) || {};
//   const user_id = body_obj.user_id;
//   const text = body_obj.text?.toLowerCase().trim() || "";
//   if(!user_id || !text){
//     return {statusCode: 400, body: "Bad Request"}
//   }
//   const [game, day, score] = parse_text(text);
//   const added = await add_score(game, day, score);
//   if(added === 0){
//     return {
//       statusCode: 200,
//       headers: {"Content-Type": "application/json"},
//       body: JSON.stringify({
//         response_type: "ephemeral",
//         text: "Sorry, that game is not supported. Please try a game that is."
//       })
//     }
//   }else if(added == 1){
//     return {
//       statusCode: 200,
//       headers: {"Content-Type": "application/json"},
//       body: JSON.stringify({
//         response_type: "ephemeral",
//         text: `${game.charAt(0).toUpperCase() + game.slice(1)} ${day} has already been submitted.`
//       })
//     }
//   }else{
//     return {
//       statusCode: 200,
//       headers: {"Content-Type": "application/json"},
//       body: JSON.stringify({
//         response_type: "in_channel",
//         text: `${game.charAt(0).toUpperCase() + game.slice(1)} ${day} score: ${score}`
//       })
//     }
//   }
// };