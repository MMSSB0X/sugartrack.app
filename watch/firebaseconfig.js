// This file initializes Firebase. It replaces the obfuscated 'securityFlase.js'.
const firebaseConfig = {
  apiKey: "AIzaSyCh2ZVSEBdtBB6RuaQIEpcghyayjRr1SXY",
  authDomain: "sugartrack-1608f.firebaseapp.com",
  projectId: "sugartrack-1608f",
  storageBucket: "sugartrack-1608f.firebasestorage.app",
  messagingSenderId: "660274075529",
  appId: "1:660274075529:web:4b8acaacde0d4199527358",
  measurementId: "G-C8BV3WJ17L",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
// const storage = firebase.storage();