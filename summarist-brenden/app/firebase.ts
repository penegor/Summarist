import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0Rr5MGkXHa0c4FNqVEbnBDMncao-U7sM",
  authDomain: "summarist-f0968.firebaseapp.com",
  projectId: "summarist-f0968",
  storageBucket: "summarist-f0968.firebasestorage.app",
  messagingSenderId: "282910253713",
  appId: "1:282910253713:web:f55b195d5257e164b4d530",
  measurementId: "G-PCSJJC1HSF"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);