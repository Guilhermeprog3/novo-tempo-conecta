import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCqbL0zu1sw2MQBtlHMlnuez9wcV_Q4fcw",
  authDomain: "novo-tempo-conecta.firebaseapp.com",
  projectId: "novo-tempo-conecta",
  storageBucket: "novo-tempo-conecta.firebasestorage.app",
  messagingSenderId: "627963268710",
  appId: "1:627963268710:web:a82031f1771707046e67a7",
  measurementId: "G-1SN9M946D0"
};


const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const analytics = getAnalytics(app);

export { app, auth, db , analytics};