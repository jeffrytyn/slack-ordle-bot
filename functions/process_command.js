import { initializeApp } from "firebase/app";
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';


if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
  // console.log(process.env.SLACK_APP_TOKEN);
}

const app = initializeApp({
    type: process.env.FSTORE_TYPE,
    project_id: process.env.FSTORE_PROJECT_ID,
    private_key_id: process.env.FSTORE_PRIVATE_KEY_ID,
    private_key: process.env.FSTORE_PRIVATE_KEY.replace(/\\n/g," "),
    client_email: process.env.FSTORE_CLIENT_EMAIL,
    client_id: process.env.FSTORE_CLIENT_ID,
    auth_uri: process.env.FSTORE_AUTH_URI,
    token_uri: process.env.FSTORE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FSTORE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FSTORE_CLIENT_X509_CERT_URL 
  });

const parse_app_mention = (text) => {
}

export async function handler({body, httpMethod, path}, context){
  const body_obj = JSON.parse(body) || {};
  const slack_event = body_obj?.event?.type || "";
  console.log(slack_event);
  if(slack_event === ''){
    return {
      statusCode: 400,
      headers: {"Content-type": "application/json"},
      body: JSON.stringify({
        error: "Invalid event type"
      })
    };
  }
  if (slack_event === 'message' || 
    slack_event === 'app_mention' || 
    slack_event === 'message.channels' || 
    slack_event === 'message.groups' || 
    slack_event === 'message.im') { 
      console.log(body_obj.event.channel);
      console.log(process.env.SLACK_APP_TOKEN)
    const res = await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        channel: body_obj.event.channel,
        text: "Hello World!"
      })
    })
    if(!res.ok){
      console.log("Failed response: " + res.status);
      return {
        statusCode: res.status,
        headers: {"Content-type": "application/json"},
      };
    }
  }
  return {statusCode: 200};
};