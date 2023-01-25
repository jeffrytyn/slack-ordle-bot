var admin = require("firebase-admin");

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  // console.log(process.env.SLACK_APP_TOKEN);
}

admin.initializeApp({
  credential: admin.credential.cert({
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
  })
});

const parse_app_mention = (text) => {
}

exports.handler = async({body, httpMethod, path}, context) => {
  const body_obj = JSON.parse(body) || {};
  const slack_event = body_obj?.event?.type || "";
  if(slack_event === ''){
    return {
      statusCode: 400,
      headers: {"Content-type": "application/json"},
      body: JSON.stringify({
        error: "Invalid event type"
      })
    };
  }
  const res = {
    statusCode: 200,
    headers: {"Content-type": "application/json"},
  }
  if (slack_event === 'app_mention') {
    parse_app_mention(body_obj.event.text);
    // const db = admin.firestore();
    // const docRef = db.collection('users').doc(body.event.user);
    // const doc = await docRef.get();
    // if (!doc.exists) {
    //   console.log('No such document!');
    // } else {
    //   console.log('Document data:', doc.data());
    // }
  }else if(slack_event === "message.im"){
    await fetch("https://slack.com/api/chat.postMessage", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify({
        token: process.env.SLACK_APP_TOKEN,
        channel: body_obj.event.channel,
        text: "Hello World!"
      })
    })
  }
  return res;
};