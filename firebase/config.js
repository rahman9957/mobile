import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBlw_Ny3CjEVq7qm-V7As-T0ADACHkyZes",
  authDomain: "crudmahasiswa-65eb0.firebaseapp.com",
  projectId: "crudmahasiswa-65eb0",
  storageBucket: "crudmahasiswa-65eb0.firebasestorage.app",
  messagingSenderId: "33633675002",
  appId: "1:33633675002:web:60a0f87129270d8fef8b43"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);