// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDLcfn9JAKHXP3ClLeS8JALUAM4zaQzogc",
  authDomain: "prescriptionassistent.firebaseapp.com",
  projectId: "prescriptionassistent",
  storageBucket: "prescriptionassistent.appspot.com",
  messagingSenderId: "899566649866",
  appId: "1:899566649866:web:43effbc4329f1c6d4755f3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage };