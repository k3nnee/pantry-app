// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCImFOv-KJ5YefFrzG-UFJsC0X12SSU4b8",
    authDomain: "inventory-management-989e7.firebaseapp.com",
    projectId: "inventory-management-989e7",
    storageBucket: "inventory-management-989e7.appspot.com",
    messagingSenderId: "924368323947",
    appId: "1:924368323947:web:f2200f9713c547d84e782e",
    measurementId: "G-J88JWC4WES"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export {firestore};