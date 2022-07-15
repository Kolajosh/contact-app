import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyBIX2yk2p0utQtOEDR9bp_W3xD7bMS4E7c",
  authDomain: "react-contactapp-966f3.firebaseapp.com",
  projectId: "react-contactapp-966f3",
  storageBucket: "react-contactapp-966f3.appspot.com",
  messagingSenderId: "59534313947",
  appId: "1:59534313947:web:2e981b5e1b59764bdabffe",
};

const fireDb = firebase.initializeApp(firebaseConfig);
export default fireDb.database().ref();
