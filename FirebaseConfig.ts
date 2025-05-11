import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBRDaOaq0Xckkxb4gzTSmOEh8Vs1GJ6NdY",
  authDomain: "savii-8d155.firebaseapp.com",
  projectId: "savii-8d155",
  storageBucket: "savii-8d155.appspot.com",
  messagingSenderId: "802013761909",
  appId: "1:802013761909:web:7fe29c45b4ed31a9f2c33c"
};

// Initialize Firebase
const FIREBASE_APP = initializeApp(firebaseConfig);
const FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
  persistence: getReactNativePersistence(AsyncStorage)
});
const FIREBASE_DB = getFirestore(FIREBASE_APP);

export { FIREBASE_APP, FIREBASE_AUTH, FIREBASE_DB };
