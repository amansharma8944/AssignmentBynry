// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore,addDoc,collection, } from "firebase/firestore";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDy84pdoIC4NsLlbf2ca6kboFRjB4raf7c",
  authDomain: "newblogapp-9fae6.firebaseapp.com",
  projectId: "newblogapp-9fae6",
  storageBucket: "newblogapp-9fae6.appspot.com",
  messagingSenderId: "254225548616",
  appId: "1:254225548616:web:16bcf0800f2bdd0297df7d",
  measurementId: "G-LEBB48CFPN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
 const db = getFirestore(app);
 const auth = getAuth(app);
 const googleProvider = new GoogleAuthProvider();

export { storage ,db,addDoc,collection,auth,signInWithPopup, GoogleAuthProvider,googleProvider};