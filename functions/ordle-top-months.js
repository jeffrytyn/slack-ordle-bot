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
  const leaders = [];
  const curr_month_ind = new Date().getUTCMonth();
  for(let i = 0; i < 12; i++){
    const month = MONTHS[(curr_month_ind - i + 12) % 12];
    const snap = await getDocFromServer(doc(db, game, month))
    if(snap.exists()){
      const data = doc.data();
      leaders.push(`${month} ${data.year}: <@${data.max_user}> with ${data.max_sore} points`)
    }else{
      leaders.push(`${month} ${i > curr_month_ind ? get_year_UTC() - 1 : get_year_UTC()}: N/A`)
    }
  }
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