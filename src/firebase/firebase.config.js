// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"


const firebaseConfig = {
  apiKey: "AIzaSyD4Tf3e1v7ye7MqE1ZijxDkIISA3Q90jCg",
  authDomain: "proyecto-final-react-5c778.firebaseapp.com",
  projectId: "proyecto-final-react-5c778",
  storageBucket: "proyecto-final-react-5c778.appspot.com",
  messagingSenderId: "146019965293",
  appId: "1:146019965293:web:07b9836101c50e09496264"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);