// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDEfG_qWbk7ksHDYvFQjO5DlhJELcliNP4",
  authDomain: "peer-project-8c6fd.firebaseapp.com",
  projectId: "peer-project-8c6fd",
  storageBucket: "peer-project-8c6fd.firebasestorage.app",
  messagingSenderId: "191203268258",
  appId: "1:191203268258:web:fb7fc63489b5f2192629fb",
  measurementId: "G-4QFPLDC5Q4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);