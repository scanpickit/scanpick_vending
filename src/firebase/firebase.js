// firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCI56RwhLBlqPJk91Vo8Vyd9xaepzwTYOY",
  authDomain: "scanpick-vending.firebaseapp.com",
  projectId: "scanpick-vending",
  storageBucket: "scanpick-vending.appspot.com",
  messagingSenderId: "562899899457",
  appId: "1:562899899457:web:18bc4492161d17229222c0",
  measurementId: "G-QJEVE90RDJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app); // Initialize Firestore

export { app, auth, db }; // Export Firestore instance as well
