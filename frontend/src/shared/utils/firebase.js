import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "mindmirror-387df.firebaseapp.com",
  projectId: "mindmirror-387df",
  storageBucket: "mindmirror-387df.firebasestorage.app",
  messagingSenderId: "767183110441",
  appId: "1:767183110441:web:6874dde269e13a6ea6f738"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth=getAuth(app)

export {auth}