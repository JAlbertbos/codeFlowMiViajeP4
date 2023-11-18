import { initializeApp } from 'firebase/app';

const firebaseConfig = {
    apiKey: "AIzaSyCBHtoO7naEQHJYFgioJDXYsLNDKJR-X74",
    authDomain: "codeflowmiviajep3.firebaseapp.com",
    projectId: "codeflowmiviajep3",
    storageBucket: "codeflowmiviajep3.appspot.com",
    messagingSenderId: "222002248733",
    appId: "1:222002248733:web:5d46b01bd1bf7fe9e25af4",
    measurementId: "G-ZBWNWPKLK4"
  };

  const app = initializeApp(firebaseConfig);
  
  // Get a list of cities from your database
