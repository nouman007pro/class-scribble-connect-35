
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDyNRuDWqItCXxFf_xwFA7IgDSKHFZJXpI",
  authDomain: "final-project-zeynab.firebaseapp.com",
  projectId: "final-project-zeynab",
  storageBucket: "final-project-zeynab.appspot.com",
  messagingSenderId: "706920717710",
  appId: "1:706920717710:web:abfda4d7eee3a9c2ec18df",
  measurementId: "G-G9HGBYPEGT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const analytics = getAnalytics(app);
export const storage = getStorage(app);
export default app;
