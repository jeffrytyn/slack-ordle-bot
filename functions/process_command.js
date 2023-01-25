var admin = require("firebase-admin");
var serviceAccount = require("../slack-ordle-bot-firebase-adminsdk-xfcl9-9d0897e3da.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  // console.log(process.env.SLACK_APP_TOKEN);
}

// var firebaseConfig = JSON.parse(fs.readFileSync('slack-ordle-bot-firebase-adminsdk-xfcl9-9d0897e3da.json', 'utf8'));

// // Create and deploy your first functions
// // https://firebase.google.com/docs/functions/get-started
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

// exports.process_message = functions.https.onRequest((req, res) => {
//   let payload = req.body;
//   console.log("Received " + JSON.stringify(payload));
//   res.sendStatus(200);
// });

exports.handler = async({queryStringParameters, body, httpMethod, path}, context) => {
  const { name = "Anonymous" } = queryStringParameters;
  return {
      statusCode: 200,
      body: `Hello, ${name}`,
      challenge: body.challenge
  };
};