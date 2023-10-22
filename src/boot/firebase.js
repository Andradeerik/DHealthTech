import firebase from "firebase/app";
//import "firebase/database";
import "firebase/auth";
//import "firebase/functions";
//import "firebase/storage";

let firebaseConfig = {
  apiKey: "AIzaSyD47b-elpkJaDeHvs0lIFZ0sruGEukMmHM",
  authDomain: "dhealthtech.firebaseapp.com",
  databaseURL: "https://dhealthtech-default-rtdb.firebaseio.com",
  projectId: "dhealthtech",
  storageBucket: "dhealthtech.appspot.com",
  messagingSenderId: "965159051151",
  appId: "1:965159051151:web:1fcc0d20f00b6a97d9b5fa",
  measurementId: "G-Q42F68K3DQ"
};

let firebaseApp = firebase.initializeApp(firebaseConfig);

let Auth = firebaseApp.auth();
//let Db = firebaseApp.database();
//let Funt = firebaseApp.functions();
// let Storage = firebaseApp.storage();
// let FireTime = firebase.database.ServerValue.TIMESTAMP;
export { Auth };
