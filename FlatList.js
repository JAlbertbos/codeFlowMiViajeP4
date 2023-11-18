import React, { useState, useEffect } from 'react';
import { FlatList, Text, View } from 'react-native';
import firebase from 'firebase/app';
import 'firebase/firestore';

const YourComponent = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Configura la conexión a Firebase
    const firebaseConfig = {
        apiKey: "AIzaSyCBHtoO7naEQHJYFgioJDXYsLNDKJR-X74",
        authDomain: "codeflowmiviajep3.firebaseapp.com",
        projectId: "codeflowmiviajep3",
        storageBucket: "codeflowmiviajep3.appspot.com",
        messagingSenderId: "222002248733",
        appId: "1:222002248733:web:5d46b01bd1bf7fe9e25af4",
        measurementId: "G-ZBWNWPKLK4"
      };

    // Inicializa Firebase
    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    // Obtiene una referencia a la colección de retos
    const retosCollection = firebase.firestore().collection('retos');

    // Recupera todos los retos de la colección
    retosCollection.get().then((querySnapshot) => {
      const retrievedData = [];
      querySnapshot.forEach((doc) => {
        // Almacena los datos en el array
        retrievedData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      setData(retrievedData); // Actualiza el estado con los datos de Firestore
    }).catch((error) => {
      console.log('Error obteniendo retos: ', error);
    });
  }, []);

  // Renderiza cada elemento de la lista
  const renderItem = ({ item }) => (
    <View>
      <Text>{item.id}</Text>
      {/* Renderiza otros datos según tu estructura */}
      <Text>{item.otroCampo}</Text>
    </View>
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default YourComponent;
