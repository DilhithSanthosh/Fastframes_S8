// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCH-p1q3Jafe8vRAo4waJfoGpxjEUNKdzQ",
    authDomain: "fast-4886e.firebaseapp.com",
    projectId: "fast-4886e",
    storageBucket: "fast-4886e.appspot.com",
    messagingSenderId: "681291211252",
    appId: "1:681291211252:web:e72cccc58afbdcaafb59a1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
