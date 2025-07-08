
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyCNHQiy-VT2Kk8LWH0PmbQENyCLx4lspwM",
  authDomain: "classroom-3cdda.firebaseapp.com",
  projectId: "classroom-3cdda",
  storageBucket: "classroom-3cdda.firebasestorage.app",
  messagingSenderId: "328724940636",
  appId: "1:328724940636:web:52ee28271aeb9b5fe6a399",
  measurementId: "G-Q6SEY7TZE1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;
