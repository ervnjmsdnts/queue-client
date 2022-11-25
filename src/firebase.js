import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBW_s2G5fImUlsUHYxcHUU9uDLEUDGPhlM",
  authDomain: "queuer-75c6a.firebaseapp.com",
  projectId: "queuer-75c6a",
  storageBucket: "queuer-75c6a.appspot.com",
  messagingSenderId: "866124033028",
  appId: "1:866124033028:web:7ea5d8d59439fb2373d951",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
