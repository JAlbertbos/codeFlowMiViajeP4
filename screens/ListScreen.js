import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';
import { getFirestore, collection, addDoc, query, getDocs } from 'firebase/firestore/lite';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyCBHtoO7naEQHJYFgioJDXYsLNDKJR-X74",
  authDomain: "codeflowmiviajep3.firebaseapp.com",
  projectId: "codeflowmiviajep3",
  storageBucket: "codeflowmiviajep3.appspot.com",
  messagingSenderId: "222002248733",
  appId: "1:222002248733:web:5d46b01bd1bf7fe9e25af4",
  measurementId: "G-ZBWNWPKLK4"};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Definir la función fetchCities fuera del componente
const fetchCities = async (setCities) => {
  const citiesCollection = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCollection);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  setCities(cityList);
};

const ListScreen = () => {
  const [newCity, setNewCity] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    // Llamar a la función fetchCities al cargar la pantalla
    fetchCities(setCities);
  }, []); // El segundo argumento vacío asegura que se ejecute solo una vez al cargar la pantalla

  const addCity = async () => {
    const citiesCollection = collection(db, 'cities');
    await addDoc(citiesCollection, { name: newCity });
    setNewCity('');
    // Después de agregar una ciudad, actualiza la lista llamando a la función fetchCities
    fetchCities(setCities);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10, width: 200 }}
        onChangeText={text => setNewCity(text)}
        value={newCity}
        placeholder="Escribe una ciudad"
      />
      <Button onPress={addCity} title="Agregar ciudad" />
      <FlatList
        data={cities}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Text>{item.name}</Text>}
      />
    </View>
  );
};

export default ListScreen;
