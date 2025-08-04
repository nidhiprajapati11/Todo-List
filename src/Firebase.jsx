// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth";
import {getFirestore} from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCyifO8Pz3oKHbNr32HKFuXPBdOlFxgKrM",
  authDomain: "todo-task-63026.firebaseapp.com",
  projectId: "todo-task-63026",
  storageBucket: "todo-task-63026.firebasestorage.app",
  messagingSenderId: "621254307370",
  appId: "1:621254307370:web:6e04e3f9ae033cb0705d53",
  measurementId: "G-282HBD6375",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();
const messaging = getMessaging(app);
export {auth,provider,db,messaging};