import React, { useState, useEffect } from 'react';
import { ScrollView, View, Button, Text, Modal, TextInput, StyleSheet, TouchableOpacity, Image, Keyboard, Dimensions} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc, doc, setDoc, query, where, getDocs, getDoc, deleteDoc } from 'firebase/firestore/lite';
import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage'; 
import { initializeApp } from 'firebase/app';
import { AntDesign } from '@expo/vector-icons';       

// Configuración de las credenciales de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCBHtoO7naEQHJYFgioJDXYsLNDKJR-X74",
  authDomain: "codeflowmiviajep3.firebaseapp.com",
  projectId: "codeflowmiviajep3",
  storageBucket: "codeflowmiviajep3.appspot.com",
  messagingSenderId: "222002248733",
  appId: "1:222002248733:web:5d46b01bd1bf7fe9e25af4",
  measurementId: "G-ZBWNWPKLK4"
};

const app = initializeApp(firebaseConfig);                // Inicializa la aplicación Firebase con la configuración proporcionada
const db = getFirestore(app);                             // Obtiene una referencia a la base de datos Firestore

// Función asincrónica para obtener datos de la colección 'cities' de Firestore
const fetchCities = async (setCities) => {
  const citiesCollection = collection(db, 'cities');                    // Obtiene una referencia a la colección 'cities' en Firestore
  const citySnapshot = await getDocs(citiesCollection);                 // Obtiene una instantánea de los documentos en la colección 'cities'
  const cityList = citySnapshot.docs.map(doc => doc.data());            // Mapea los datos de los documentos en la instantánea a una matriz y extrae los datos de cada documento
  setCities(cityList);                                                  // Actualiza el estado de las ciudades con la lista de datos obtenida de Firestore
};

const PlayerScreen = ({ route }) => {
  const { currentCity } = route.params;

  const reproducirVideo = () => {
    // Lógica para reproducir el video
    // Puedes utilizar librerías como react-native-video
  };

  return (
    <View>
      <Text>Video Component</Text>
      <Button title="Reproducir Video" onPress={reproducirVideo} />
      {/* Otros elementos para mostrar el video */}
    </View>
  );
};

export default PlayerScreen;
