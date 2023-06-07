import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { getFirestore} from "firebase/firestore"
import 'firebase/functions'; 
import { getDatabase, ref } from 'firebase/database';
import { onValue } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyAZ2DX6pbeYX2XSLe0RtL9xeGjMHjf2LkM",
  authDomain: "ishaan-bd6b9.firebaseapp.com",
  databaseURL: "https://ishaan-bd6b9-default-rtdb.firebaseio.com",
  projectId: "ishaan-bd6b9",
  storageBucket: "ishaan-bd6b9.appspot.com",
  messagingSenderId: "363534819765",
  appId: "1:363534819765:web:dcf0251529d96ada7ef9fc",
  measurementId: "G-N7NWBCCBQJ",
};
const firebaseApp = firebase.initializeApp(firebaseConfig);


const db = getFirestore(firebaseApp);
const auth = firebase.auth();
const database = getDatabase(firebaseApp);
const dbRef = ref(database);

export { auth, db, dbRef, ref,onValue,database };
