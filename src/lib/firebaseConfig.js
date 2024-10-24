import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCAisC0cr-mTJRmOHAzKyvnCmLtbgjs8wM",
  authDomain: "blog-addict-76be1.firebaseapp.com",
  projectId: "blog-addict-76be1",
  storageBucket: "blog-addict-76be1.appspot.com",
  messagingSenderId: "46686640692",
  appId: "1:46686640692:web:5cd1cfc904e4e0d36a8861"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);