import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore} from "firebase/firestore"
import 'firebase/functions'; 
import { getDatabase, ref } from 'firebase/database';
import { onValue } from 'firebase/database';
const firebaseConfig = {

  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID
};
const firebaseApp = firebase.initializeApp(firebaseConfig);

const db = getFirestore(firebaseApp);
const auth = firebase.auth();
const database = getDatabase(firebaseApp);
const dbRef = ref(database);

export { auth, db, dbRef, ref,onValue,database };
