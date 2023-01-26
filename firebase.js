import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import * as dotenv from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

const firebaseConfig = {
  apiKey: process.env.FSTORE_API_KEY,
  authDomain: process.env.FSTORE_AUTH_DOMAIN,
  projectId: process.env.FSTORE_PROJECT_ID,
  storageBucket: process.env.FSTORE_STORAGE_BUCKET,
  messagingSenderId: process.env.FSTORE_MESSAGING_SENDER_ID,
  appId: process.env.FSTORE_APP_ID,
  measurementId: process.env.FSTORE_MEASUREMENT_ID
};

// console.log(JSON.stringify(firebaseConfig))
async function init_auth(){
  const auth = getAuth(app);
  await signInAnonymously(auth)
    .then(() => {
      console.log("Firebase signed in anonymously");
    })
    .catch((error) => {
      console.log(`${error.message}`);
    });
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
onAuthStateChanged(auth, async (user) => {
  if (user) {
    console.log("Firebase signed in");
  } else {
    await signInAnonymously(auth)
      .catch((error) => {
        console.log(`${error.message}`);
      });
  }
});

export default db;