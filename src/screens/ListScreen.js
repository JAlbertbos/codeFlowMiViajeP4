import React, { useState, useEffect } from 'react';
import { View, Button, FlatList, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
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
  const [cities, setCities] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchCities(setCities);
  }, []);

  const addCityDetails = async () => {
    const citiesCollection = collection(db, 'cities');
    const newCityData = {
      name,
      day,
      accommodation,
      description,
    };
    await addDoc(citiesCollection, newCityData);
    setModalVisible(false);
    setName('');
    setDay('');
    setAccommodation('');
    setDescription('');
    fetchCities(setCities);
  };

  const navigateToDetail = (cityName) => {
    navigation.navigate('DetailScreen', { city: cityName });
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={openModal} title="Agregar ciudad" />
      <FlatList
        data={cities}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigateToDetail(item.name)}>
            <Text style={styles.cityText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
        <TextInput
            style={styles.input}
            onChangeText={text => setName(text)}
            value={name}
            placeholder="Ciudad"
          />
          <TextInput
            style={styles.input}
            onChangeText={text => setDay(text)}
            value={day}
            placeholder="Día"
          />
          <TextInput
            style={styles.input}
            onChangeText={text => setAccommodation(text)}
            value={accommodation}
            placeholder="Alojamiento"
          />
          <TextInput
            style={styles.input}
            onChangeText={text => setDescription(text)}
            value={description}
            placeholder="Descripción"
          />
          <Button onPress={addCityDetails} title="Guardar detalles" />
          <Button onPress={closeModal} title="Cerrar" />
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: 200,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
  },
});

export default ListScreen;
