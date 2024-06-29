// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAZNmqWRkFhGAqAIiQbIlgoA6hlD8BJU-8",
  authDomain: "ligabot-38d61.firebaseapp.com",
  databaseURL: "https://ligabot-38d61-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "ligabot-38d61",
  storageBucket: "ligabot-38d61.appspot.com",
  messagingSenderId: "99722118463",
  appId: "1:99722118463:web:7201e994436d2f2bca3f8a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export {db, auth, storage};