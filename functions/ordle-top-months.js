import {db} from "../firebase.js"
import { doc, getDocFromServer} from "firebase/firestore";
import slack_verify from "../slack_verify.js";
import qs from "qs";
import {SUPPORTED_GAMES, get_year_UTC, MONTHS} from "../game_parsers.js";


export async function handler({body, headers}, context){
  if(!slack_verify(headers["x-slack-request-timestamp"], body, headers["x-slack-signature"])){
    console.log("not slack request");
    return {statusCode: 401, body: "Unauthorized"}
  }
  const body_obj = qs.parse(body) || {};
  const game = body_obj.text?.toLowerCase().trim() || "";
  
  if(!SUPPORTED_GAMES.has(game)){
    return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        response_type: "ephemeral",
        text: (game.length === 0) ? "Please enter a game name." : `Sorry, '${game}' is not supported. See OrdleBot info for valid games.`
      })}
  }
  const promises = [];
  const curr_month_ind = new Date().getUTCMonth();
  for(let i = 1; i < 12; i++){
    const month = MONTHS[(curr_month_ind - i + 12) % 12];
    promises.push(getDocFromServer(doc(db, game, month)))
  }

  const leaders = [];
  await Promise.allSettled(promises).then((results) => {
    results.forEach((result, i) => {
      const month = MONTHS[(curr_month_ind - i + 12) % 12];
      if(result.status === "fulfilled"){
        const snap = result.value;
        if(snap.exists()){
          const data = snap.data();
          leaders.push(`${month} ${data.year}: <@${data.max_user}> with ${data.max_sore} points`)
        }else{
          leaders.push(`${month} ${i > curr_month_ind ? get_year_UTC() - 1 : get_year_UTC()}: _N/A_`)
        }
      }
    })
  })
  return {
    statusCode: 200,
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({
      response_type: "in_channel",
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*${game.charAt(0).toUpperCase() + game.slice(1)} Past Leaders*\n${leaders.join("\n")}`
          }
        }
      ]
    })}
};