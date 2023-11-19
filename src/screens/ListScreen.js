import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc, query, getDocs } from 'firebase/firestore/lite';
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
const db = getFirestore(app);

const fetchCities = async (setCities) => {
  const citiesCollection = collection(db, 'cities');
  const citySnapshot = await getDocs(citiesCollection);
  const cityList = citySnapshot.docs.map(doc => doc.data());
  setCities(cityList);
};

const ListScreen = ({ navigation }) => {
  const [newCity, setNewCity] = useState('');
  const [cities, setCities] = useState([]);

  useEffect(() => {
    fetchCities(setCities);
  }, []);

  const addCity = async () => {
    const citiesCollection = collection(db, 'cities');
    await addDoc(citiesCollection, { name: newCity });
    setNewCity('');
    fetchCities(setCities);
  };

  const navigateToDetail = (cityName) => {
    navigation.navigate('DetailScreen', { city: cityName });
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
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToDetail(item.name)}>
            <Text style={styles.cityText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  cityText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
});

export default ListScreen;
