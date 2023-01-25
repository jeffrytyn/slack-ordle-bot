var admin = require("firebase-admin");
var serviceAccount = require("../slack-ordle-bot-firebase-adminsdk-xfcl9-9d0897e3da.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  // console.log(process.env.SLACK_APP_TOKEN);
}

const parse_app_mention = (text) => {
}

exports.handler = async({body, httpMethod, path}, context) => {
  if (body.event.type === 'app_mention') {
    parse_app_mention(body.event.text);
    // const db = admin.firestore();
    // const docRef = db.collection('users').doc(body.event.user);
    // const doc = await docRef.get();
    // if (!doc.exists) {
    //   console.log('No such document!');
    // } else {
    //   console.log('Document data:', doc.data());
    // }
  }
  return {
      statusCode: 200,
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({
        challenge: body.challenge,
      })
  };
};