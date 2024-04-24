// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from  "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwbfOCJ4_v7dD-Tn6FLLv9J7DWwo76YYQ",
  authDomain: "borewells-75ecd.firebaseapp.com",
  projectId: "borewells-75ecd",
  storageBucket: "borewells-75ecd.appspot.com",
  messagingSenderId: "321420123825",
  appId: "1:321420123825:web:c9e68e64ea488027174c90",
  measurementId: "G-THE885Y0Z8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth =getAuth(app)
 export {app,analytics,auth}