import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCkiL_ZyjBEiY6NfD7ihk20nBP-PePkjXU",
    authDomain: "chenzotv-e811a.firebaseapp.com",
    projectId: "chenzotv-e811a",
    storageBucket: "chenzotv-e811a.appspot.com",
    messagingSenderId: "939651085415",
    appId: "1:939651085415:web:9df1f9afeb0e68213490c2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);