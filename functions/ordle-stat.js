import {db} from "../firebase.js"
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import slack_verify from "../slack_verify.js";
import qs from "qs";
import {SUPPORTED_GAMES} from "../game_parsers.js";



export async function handler({body, headers}, context){
  if(!slack_verify(headers["x-slack-request-timestamp"], body, headers["x-slack-signature"])){
    console.log("not slack request");
    return {statusCode: 401, body: "Unauthorized"}
  }
  const body_obj = qs.parse(body) || {};
  const user_id = body_obj.user_id;
  if(!user_id){
    return {statusCode: 400, body: "Bad Request"}
  }
  const stats = [];
  for(const game of SUPPORTED_GAMES){
    const game_title = game.charAt(0).toUpperCase() + game.slice(1);
    const promises = [getDocs(collection(db, game, user_id, "scores")), getDoc(doc(db, game, user_id))];
    const settled = await Promise.allSettled(promises);
    let days = -1;
    let total = -1;
    let month_total = -1;
    if(settled[0].status === "fulfilled"){
      days = settled[0].value.docs.length;
      total = settled[0].value.docs.reduce((acc, doc) => acc + doc.data().score, 0);
    }
    if(settled[1].status === "fulfilled"){
      month_total = settled[1].value.data().total;
    }
    stats.push(`*${game_title} stats:*\n
      Lifetime days played: ${days === -1 ? 'Error' : days}\n
      Lifetime average score: ${days === -1 ? 'Error': (total/days).toFixed(2)}\n
      Total score this month: ${month_total === -1 ? 'Error' : month_total}`);

  }
  return {
    statusCode: 200,
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      response_type: "ephemeral",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: stats.join("\n")
          }
        }
      ]
    })}
  }
//   const snap = await getDocFromServer(doc(db, game, user_id))
//   if(snap.exists()){
//     const score = snap.data().total;
//     const days = await getCountFromServer(collection(db, game, user_id, "scores"));
//     return {
//       statusCode: 200,
//       headers: {"Content-Type": "application/json"},
//       body: JSON.stringify({
//         response_type: "ephemeral",
//         blocks: [
//           {
//             type: "section",
//             text: {
//               type: "mrkdwn",
//               text: `*${game.charAt(0).toUpperCase() + game.slice(1)} Stats*\nTotal score: ${score}\nDays played: ${days.data().count}`
//             }
//           }
//         ]
//       })}
//   }else{
//     return {
//       statusCode: 200,
//       headers: {"Content-Type": "application/json"},
//       body: JSON.stringify({
//         response_type: "ephemeral",
//         text: `No score for ${game.charAt(0).toUpperCase() + game.slice(1)} found.`
//       })}
//   }
// };