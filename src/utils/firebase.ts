// src/utils/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIbyJmWRLB3Y0HQ0k0FwjkSHDORfLKTsI",
  authDomain: "res-firebase.firebaseapp.com",
  projectId: "res-firebase",
  storageBucket: "res-firebase.firebasestorage.app",
  messagingSenderId: "112620984395",
  appId: "1:112620984395:web:e4c2573929fec8a80015ce"
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);

// Firebase Auth and Google Provider
const auth = getAuth(firebase);
const googleProvider = new GoogleAuthProvider();

// Firestore Database
const db = getFirestore(firebase);

export { auth, googleProvider, db };
