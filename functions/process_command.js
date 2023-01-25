var admin = require("firebase-admin");
var serviceAccount = require("../slack-ordle-bot-firebase-adminsdk-xfcl9-9d0897e3da.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
  // console.log(process.env.SLACK_APP_TOKEN);
}

exports.handler = async({queryStringParameters, body, httpMethod, path}, context) => {
  const { name = "Anonymous" } = queryStringParameters;
  return {
      statusCode: 200,
      body: {
        challenge: body.challenge,
        res: "Hello, " + name + "!"
      }
  };
};