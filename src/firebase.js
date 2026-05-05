import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAUCVa_Q_yajjhTFm8SlPHR3Dvd2qYIT7Y",
  authDomain: "capstone-d5a20.firebaseapp.com",
  projectId: "capstone-d5a20",
  storageBucket: "capstone-d5a20.firebasestorage.app",
  messagingSenderId: "757820704215",
  appId: "1:757820704215:web:18f26cad124c634813f792"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);