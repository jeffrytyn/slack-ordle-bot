import {db} from "../firebase.js"
import {getDocs, doc, where} from "firebase/firestore";
import slack_verify from "../slack_verify.js";
import qs from "qs";
import {SUPPORTED_GAMES, get_year_UTC, MONTHS} from "../game_parsers.js";

const adj_month_ind = (month_ind, start_ind) => {
  return (12 + start_ind - month_ind) % 12;
}

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
  const snap = await getDocs(doc(db, game), where("max_users", "!=", ""));
  const curr_month_ind = new Date().getUTCMonth();
  const month_to_text = new Array(12);
  month_to_text.fill(null);
  for(const doc of snap.docs){
    const data = doc.data();
    const adj_ind = adj_month_ind(MONTHS.indexOf(doc.id), curr_month_ind);
    month_to_text[adj_ind] = `${doc.id} ${data.year}: ${data.max_users} with ${data.max_score} points`;
  }
  console.log(month_to_text)
  for(let i = 0; i < 12; i++){
    const adj_ind = adj_month_ind(i, curr_month_ind);
    if(!month_to_text[adj_ind]){
      month_to_text[adj_ind] = `${MONTHS[i]} ${i > curr_month_ind ? get_year_UTC() - 1 : get_year_UTC()}: _N/A_`;
    }
  }

  // const leaders = [];
  // await Promise.allSettled(promises).then((results) => {
  //   results.forEach((result, i) => {
  //     const month = MONTHS[(curr_month_ind - i + 11) % 12];
  //     if(result.status === "fulfilled"){
  //       const snap = result.value;
  //       if(snap.exists()){
  //         const data = snap.data();
  //         leaders.push(`${month} ${data.year}: <@${data.max_user}> with ${data.max_sore} points`)
  //       }else{
  //         leaders.push(`${month} ${i > curr_month_ind ? get_year_UTC() - 1 : get_year_UTC()}: _N/A_`)
  //       }
  //     }
  //   })
  // })
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
            text: `*${game.charAt(0).toUpperCase() + game.slice(1)} Past Leaders*\n${Object.values(month_to_text).join("\n")}`
          }
        }
      ]
    })}
};