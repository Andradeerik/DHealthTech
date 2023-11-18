import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut } from "firebase/auth";
import { getDatabase, ref, set, onValue, child, get, update, off, remove } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD47b-elpkJaDeHvs0lIFZ0sruGEukMmHM",
  authDomain: "dhealthtech.firebaseapp.com",
  databaseURL: "https://dhealthtech-default-rtdb.firebaseio.com",
  projectId: "dhealthtech",
  storageBucket: "dhealthtech.appspot.com",
  messagingSenderId: "965159051151",
  appId: "1:965159051151:web:1fcc0d20f00b6a97d9b5fa",
  measurementId: "G-Q42F68K3DQ"
};

const app = initializeApp(firebaseConfig);
const provider = new GoogleAuthProvider();
const db = getDatabase(app);
const refDB = ref
// provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

const auth = getAuth(app);
// auth.languageCode = 'it';
//let Db = firebaseApp.database();
//let Funt = firebaseApp.functions();
// let Storage = firebaseApp.storage();
// let FireTime = firebase.database.ServerValue.TIMESTAMP;
export {
  auth,
  provider,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  db,
  refDB,
  set,
  onValue,
  child,
  get,
  update,
  off,
  remove
};
