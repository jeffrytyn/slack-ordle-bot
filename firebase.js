import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
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

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;