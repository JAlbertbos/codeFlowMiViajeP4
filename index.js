// Importa la función `initializeApp` de la librería de Firebase
import { initializeApp } from 'firebase/app';

// Configuración de Firebase, contiene información de autenticación y conexión a la base de datos
const firebaseConfig = {
    apiKey: "AIzaSyCBHtoO7naEQHJYFgioJDXYsLNDKJR-X74",
    authDomain: "codeflowmiviajep3.firebaseapp.com",
    projectId: "codeflowmiviajep3",
    storageBucket: "codeflowmiviajep3.appspot.com",
    messagingSenderId: "222002248733",
    appId: "1:222002248733:web:5d46b01bd1bf7fe9e25af4",
    measurementId: "G-ZBWNWPKLK4"
  };
  
  // Inicializa la aplicación de Firebase con la configuración provista
  const app = initializeApp(firebaseConfig);
  
