import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA5Ymb-FglhYD2mGUzWNiMh2r08vul4hFI",
  authDomain: "mutiara-finance.firebaseapp.com",
  projectId: "mutiara-finance",
  storageBucket: "mutiara-finance.appspot.com", 
  messagingSenderId: "846315686392",
  appId: "1:846315686392:web:ff64767c3c5a96df1aae0d",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
