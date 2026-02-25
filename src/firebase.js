// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getDatabase} from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyB7rj_pMRmYRVzR9MX2jUscNrsYZTOVRdc",
    authDomain: "berry-e6afe.firebaseapp.com",
    databaseURL: "https://berry-e6afe-default-rtdb.firebaseio.com",
    projectId: "berry-e6afe",
    storageBucket: "berry-e6afe.firebasestorage.app",
    messagingSenderId: "366053966045",
    appId: "1:366053966045:web:3b514002c5237facd25b34",
    measurementId: "G-VCMW3DQQG0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const database = getDatabase(app);