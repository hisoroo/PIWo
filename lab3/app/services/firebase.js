import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "piwo-f7c12.firebaseapp.com",
  projectId: "piwo-f7c12",
  storageBucket: "piwo-f7c12.firebasestorage.app",
  messagingSenderId: "771556702303",
  appId: "1:771556702303:web:a5a2efa1b6248c479b83ea",
  measurementId: "G-S8NPQEVXSY",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
