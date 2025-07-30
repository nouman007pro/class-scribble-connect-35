
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyAQUNAglBEa0dkHwgDV5_rFX9Ce1Mp1fjc",
  authDomain: "classroom-233dd.firebaseapp.com",
  projectId: "classroom-233dd",
  storageBucket: "classroom-233dd.firebasestorage.app",
  messagingSenderId: "396322462778",
  appId: "1:396322462778:web:38b13d9aeaa3304f746903",
  measurementId: "G-X9T3BR1TCF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;
