import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
// import 'firebase/compat/firestore';
import { getFirestore} from "firebase/firestore"

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

// Use these for db & auth
// const db = firebaseApp.firestore();
const db = getFirestore(firebaseApp);
const auth = firebase.auth();

export { auth, db };