import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: 'AIzaSyBl3IE9yA-8gU7txtzpXVFj',
  authDomain: 'bm-buzz.firebaseapp.com',
  projectId: 'bm-buzz',
  storageBucket: 'bm-buzz.firebasestorage.app',
  messagingSenderId: '228676730388',
  appId: '1:228676730388:web:cb0777871b52e704d83101',
  measurementId: 'G-L4TTMWLZFT'
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);