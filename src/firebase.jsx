// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import {getFirestore } from "firebase/firestore"

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBoAQ1UB6xAL2nbHMbxCenSg7VfwbYejtQ",
  authDomain: "radhaborewell-cb9dc.firebaseapp.com",
  projectId: "radhaborewell-cb9dc",
  storageBucket: "radhaborewell-cb9dc.appspot.com",
  messagingSenderId: "662046991544",
  appId: "1:662046991544:web:b38d986118cf73d083004d",
  measurementId: "G-9P6QTVGE0N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore(app)

