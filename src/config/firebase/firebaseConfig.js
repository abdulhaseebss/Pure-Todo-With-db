import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";



// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const FirebaseConfig = {
  apiKey: "AIzaSyBU6JKPbV8FVUuNgRuDQc-hZqF5zIuOrNk",
  authDomain: "new-project-class-ba946.firebaseapp.com",
  projectId: "new-project-class-ba946",
  storageBucket: "new-project-class-ba946.appspot.com",
  messagingSenderId: "1087895984651",
  appId: "1:1087895984651:web:3e6e43f6b19416117b050e",
  measurementId: "G-YQ3RVFG0X3"
};

const app = initializeApp(FirebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app