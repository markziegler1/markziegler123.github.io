//firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBKbloe8uo8XPfNy6jkMcOcksll53rreWA",
  authDomain: "fitness-3ce03.firebaseapp.com",
  projectId: "fitness-3ce03",
  storageBucket: "fitness-3ce03.appspot.com",
  messagingSenderId: "749857096310",
  appId: "1:749857096310:web:e22d41902ed67f89fa5557"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
export { app, database };