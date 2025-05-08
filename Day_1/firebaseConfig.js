
  // Import the functions 
  import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
  import { getAuth } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
  import { getFirestore } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
  const firebaseConfig = {
    apiKey: "AIzaSyCOaPQ8v3HZgNWdYjc6FGGsFYkduOKEKlg",
    authDomain: "crowdfundingplatformfinance.firebaseapp.com",
    projectId: "crowdfundingplatformfinance",
    storageBucket: "crowdfundingplatformfinance.firebasestorage.app",
    messagingSenderId: "189550155264",
    appId: "1:189550155264:web:7677777911b6f0f61eeae5",
    measurementId: "G-7J70KKWJP9"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth  = getAuth(app)
  const db = getFirestore(app) 
  export {auth,db} 
