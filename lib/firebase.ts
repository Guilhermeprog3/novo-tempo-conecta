// guilhermeprog3/novo-tempo-conecta/lib/firebase.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCqbL0zu1sw2MQBtlHMlnuez9wcV_Q4fcw",
  authDomain: "novo-tempo-conecta.firebaseapp.com",
  projectId: "novo-tempo-conecta",
  storageBucket: "novo-tempo-conecta.firebasestorage.app",
  messagingSenderId: "627963268710",
  appId: "1:627963268710:web:a82031f1771707046e67a7",
  measurementId: "G-1SN9M946D0"
};

// Inicializa a App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

// Inicializa o Analytics de forma segura para o Server-Side Rendering (SSR)
const analytics = typeof window !== "undefined" 
  ? isSupported().then(yes => yes ? getAnalytics(app) : null) 
  : null;

export { app, auth, db, analytics };