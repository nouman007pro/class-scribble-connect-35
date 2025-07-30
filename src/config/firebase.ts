
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyDmMfY-Rmrp-FD5OhO4buwqQv6-XAm_QmA",
  authDomain: "final-project-1f2cd.firebaseapp.com",
  projectId: "final-project-1f2cd",
  storageBucket: "final-project-1f2cd.firebasestorage.app",
  messagingSenderId: "13347361327",
  appId: "1:13347361327:web:e69371e029edd07ca36cda",
  measurementId: "G-8T9MCF00EM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export default app;
