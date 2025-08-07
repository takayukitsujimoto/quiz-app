// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
  apiKey: "AIzaSyBu-HirQvEdFh72rSNp5tlbDanY3_TCaUc",
  authDomain: "pathologyquizapp.firebaseapp.com",
  projectId: "pathologyquizapp",
  storageBucket: "pathologyquizapp.firebasestorage.app",
  messagingSenderId: "281543874376",
  appId: "1:281543874376:web:2302f0654937a3a7e9457d"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 
