// =========================
// FIREBASE CONFIGURATION
// =========================

// Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyA2fd4pEKN8WbJfqvMHu8yV3vi6qoGiYdY",
  authDomain: "maros-sigap.firebaseapp.com",
  projectId: "maros-sigap",
  storageBucket: "maros-sigap.firebasestorage.app",
  messagingSenderId: "807027358134",
  appId: "1:807027358134:web:03b0225fb036e210d32917",
  measurementId: "G-0YHLLNXMP3"
};

// Initialize Firebase (using compat mode)
if (typeof firebase !== 'undefined') {
  firebase.initializeApp(firebaseConfig);
  
  // Initialize Firestore
  const db = firebase.firestore();
  
  // Export for use in other files
  window.db = db;
  window.firebase = firebase;
  
  console.log('Firebase initialized successfully');
} else {
  console.error('Firebase SDK not loaded! Make sure Firebase scripts are included before this file.');
}

