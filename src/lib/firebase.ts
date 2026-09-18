import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyB1UUA505VHpcHvJcZf01A8xq-BpNv4-YI",
  authDomain: "artisan-12561.firebaseapp.com",
  databaseURL: "https://artisan-12561-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "artisan-12561",
  storageBucket: "artisan-12561.firebasestorage.app",
  messagingSenderId: "782038599014",
  appId: "1:782038599014:web:7288f100452421d46774a7"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
