import React, { useState } from 'react';
import { View, Button, Text, Modal, TextInput, StyleSheet } from 'react-native';
import { getFirestore, collection, addDoc, doc, setDoc, query, where, getDocs, deleteDoc } from 'firebase/firestore/lite';

import { initializeApp } from 'firebase/app';   


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

// Inicializa la aplicación Firebase con la configuración proporcionada
const app = initializeApp(firebaseConfig);
// Obtiene una referencia a la base de datos Firestore
const db = getFirestore(app);

const updateCityDetails = async (initName, name, day, accommodation, activities, description, setModalVisible) => {
  const cityId = await findCityIdByName(initName);

  const cityDocRef = doc(db, 'cities', cityId); // Referencia al documento específico de la ciudad
  const updatedCityData = {
    name,
    day,
    accommodation,
    activities,
    description: description || '',
  };

  await setDoc(cityDocRef, updatedCityData, { merge: true }); // Actualiza los detalles de la ciudad

  // Limpia los campos de entrada y cierra el modal (simulación, puedes ajustar esto según tu lógica)
  setModalVisible(false);
  setName('');
  setDay('');
  setAccommodation('');
  setActivities('');
  setDescription('');

  fetchCities(setCities);
  //navigation.navigate('ListScreen');
};

const findCityIdByName = async (cityName) => {
  const citiesCollection = collection(db, 'cities'); // Referencia a la colección 'cities'
  
  // Realiza una consulta para encontrar el documento que coincida con el nombre de la ciudad
  const q = query(citiesCollection, where('name', '==', cityName));
  
  // Obtiene los documentos que coinciden con la consulta
  const querySnapshot = await getDocs(q);
  
  // Verifica si se encontró algún documento
  if (!querySnapshot.empty) {
    // Devuelve el cityId del primer documento que coincide con el nombre de la ciudad
    return querySnapshot.docs[0].id;
  } else {
    // Si no se encontró ningún documento que coincida con el nombre de la ciudad
    return null;
  }
};

const DetailScreen = ({ route }) => {
  const { item } = route.params || {}; 

  const [modalVisible, setModalVisible] = useState(false);
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [accommodation, setAccommodation] = useState('');
  const [activities, setActivities] = useState('');
  const [description, setDescription] = useState('');

  const openModal = () => {
    setModalVisible(true);  
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <View>
      <View>
        <Text>Detalles del Día {item.day}</Text>
        <Text>Nombre: {item.name}</Text>
        <Text>Alojamiento: {item.accommodation}</Text>
        <Text>Descripción: {item.description}</Text>
        <Text>Actividades: {item.activities}</Text>
        <Button onPress={openModal} title="Editar Día" />
      </View>
      
      <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}>
        <View style={styles.modalContainer}>
        {/* Campos para agregar detalles de la nueva ciudad */}
        <TextInput
            style={styles.input}
            onChangeText={text => setName(text)}
            value={name}
            placeholder={item.name}
        />
        <TextInput
            style={styles.input}
            onChangeText={text => setDay(text)}
            value={day}
            placeholder={item.day}
        />
        <TextInput
            style={styles.input}
            onChangeText={text => setAccommodation(text)}
            value={accommodation}
            placeholder={item.accommodation}
        />
        <TextInput
            style={styles.input}
            onChangeText={text => setActivities(text)}
            value={activities}
            placeholder={item.activities}
        />
        <TextInput
            style={styles.descriptionInput}
            onChangeText={text => setDescription(text)}
            value={description}
            placeholder= {item.description}
            multiline={true} 
        />
        <Button onPress={() => updateCityDetails(item.name, name, day, accommodation, activities, description, setModalVisible)} title="Guardar detalles" />
        {/* Botón para cerrar el modal */}
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
  descriptionInput: {
    height: 100, // Aumenta la altura para la descripción
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: 200,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
});

export default DetailScreen;
