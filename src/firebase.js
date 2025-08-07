// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "あなたのAPIキー",
  authDomain: "xxxx.firebaseapp.com",
  projectId: "あなたのプロジェクトID",
  storageBucket: "xxxx.appspot.com",
  messagingSenderId: "xxxxxxxx",
  appId: "xxxxxxxxxxxxxxxxxx"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
