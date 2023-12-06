import React, { useState, useEffect } from 'react';
import { View, Button, FlatList, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc, query, getDocs, deleteDoc } from 'firebase/firestore/lite';
import { initializeApp } from 'firebase/app';
import { AntDesign } from '@expo/vector-icons'; 

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
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [cityFilter, setCityFilter] = useState('');
  const [selectedDay, setSelectedDay] = useState('');

  
  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  const applyFilter = () => {
    // Aquí podrías aplicar la lógica para filtrar las ciudades según los valores en cityFilter y selectedDay
    // Por ejemplo, podrías tener una función que filtre las ciudades y actualice la lista de ciudades mostradas
    // fetchFilteredCities(cityFilter, selectedDay);
    setCityFilter('');
    setSelectedDay('');
    setFilterModalVisible(false);
  };




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

  const navigateToDetail = (item) => {
    navigation.navigate('DetailScreen', { item });
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const deleteCity = async (cityName) => {
    const citiesCollection = collection(db, 'cities');
    const cityQuery = query(citiesCollection);
    const citySnapshot = await getDocs(cityQuery);
    citySnapshot.forEach(async (doc) => {
      if (doc.data().name === cityName) {
        const docRef = doc.ref; // Obtener la referencia al documento
        await deleteDoc(docRef); // Eliminar el documento usando la referencia
      }
    });
    fetchCities(setCities);
    // Mostrar un mensaje de alerta al usuario
    alert('Ciudad eliminada');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={openModal} title="Agregar ciudad" />
      <FlatList
        data={cities}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.cityContainer}>
            <TouchableOpacity onPress={() => navigateToDetail(item)}>
              <Text style={styles.cityText}>{item.name}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteCity(item.name)}>
              <AntDesign name="delete" size={24} color="black" />
            </TouchableOpacity>
          </View>
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

      <Button onPress={openFilterModal} title="Filtrar ciudades" />

<Modal
  animationType="slide"
  transparent={true}
  visible={filterModalVisible}
  onRequestClose={closeFilterModal}
>
  <View style={styles.modalContainer}>
    <TextInput
      style={styles.input}
      onChangeText={text => setCityFilter(text)}
      value={cityFilter}
      placeholder="Buscar por ciudad"
    />
    <Button onPress={applyFilter} title="Aplicar filtro" />
    <Button onPress={closeFilterModal} title="Cerrar" />
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
