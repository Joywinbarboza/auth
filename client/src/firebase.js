// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-auth-81b0f.firebaseapp.com",
  projectId: "mern-auth-81b0f",
  storageBucket: "mern-auth-81b0f.appspot.com",
  messagingSenderId: "621937409134",
  appId: "1:621937409134:web:03d8d7231269fd69c3fa7f"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);