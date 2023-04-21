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
  const stats = {};
  const promises = [];
  for(const game of SUPPORTED_GAMES){
    const game_title = game.charAt(0).toUpperCase() + game.slice(1);
    stats[game_title] = {};
    promises.push(getDocs(collection(db, game, user_id, "scores"))
      .then(snap => {
        const days = snap.docs.length;
        const total = snap.docs.reduce((acc, doc) => acc + doc.data().score, 0);
        return {
          game_title,
          days,
          total
        }
      })
    );
    promises.push(getDoc(doc(db, game, user_id)).then(snap => {
      return {game_title, month_total: snap.exists() ? snap.data().total : 0};
    }
    ));
    // const promises = [getDocs(collection(db, game, user_id, "scores")), getDoc(doc(db, game, user_id))];
    // const settled = await Promise.allSettled(promises);
    // let days = 0;
    // let total = 0;
    // let month_total = 0;
    // if(settled[0].status === "fulfilled"){
    //   days = settled[0].value.docs.length;
    //   total = settled[0].value.docs.reduce((acc, doc) => acc + doc.data().score, 0);
    // }
    // if(settled[1].status === "fulfilled" && settled[1].value.exists()){
    //   month_total = settled[1].value.data().total;
    // }
    // stats.push(`*${game_title} stats:*\n\
    // Lifetime days played: ${days}\n\
    // Lifetime average score: ${days === 0 ? 'N/A': (total/days).toFixed(2)}\n\
    // Total score this month: ${month_total}`);
  }
  const settled = await Promise.allSettled(promises);
  settled.forEach(promise => {
    if(promise.status === "fulfilled"){
      const {game_title, days=0, total=0, month_total=0} = promise.value;
      if(days) stats[game_title].days = days;
      if(total) stats[game_title].total = total;
      if(month_total) stats[game_title].month_total = month_total;
    }
  });
  const text = Object.entries(stats).map(([game, stats]) => `*${game} stats:*\n\
  Lifetime days played: ${stats.days}\n\
  Lifetime average score: ${stats.days === 0 ? 'N/A': (stats.total/stats.days).toFixed(2)}\n\
  Total score this month: ${stats.month_total}`).join("\n");

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
            text
          }
        }
      ]
    })}
  }