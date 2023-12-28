// Importa la función `initializeApp` de la librería de Firebase
import { initializeApp } from 'firebase/app';

// Configuración de Firebase, contiene información de autenticación y conexión a la base de datos
const firebaseConfig = {
  apiKey: "AIzaSyAIxvIBjZFRaAKTg3IS8YQ4fXHfnQA_AC4",
  authDomain: "codeflowmiviajep4.firebaseapp.com",
  projectId: "codeflowmiviajep4",
  storageBucket: "codeflowmiviajep4.appspot.com",
  messagingSenderId: "239418664935",
  appId: "1:239418664935:web:179126ec4a0f3809797f42",
  measurementId: "G-JRF1F928L1"
};
  
  // Inicializa la aplicación de Firebase con la configuración provista
  const app = initializeApp(firebaseConfig);
  
