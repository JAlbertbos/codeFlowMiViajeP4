
// Importa los módulos necesarios desde React y React Native
import React, { useState, useEffect } from 'react';
import { View, Button, FlatList, Text, TouchableOpacity, Modal, Image, TextInput, StyleSheet } from 'react-native';
import ImagePicker from 'react-native-image-picker';
// Importa funciones específicas de Firestore
import { getFirestore, collection, addDoc, query, getDocs, deleteDoc } from 'firebase/firestore/lite';
import { initializeApp } from 'firebase/app';                                                                 // Importa la función de inicialización de Firebase
import { getStorage, ref, uploadBytes } from '@firebase/storage';                                             // Importa funciones específicas de Firebase Storage
import { AntDesign } from '@expo/vector-icons';                                                               // Importa iconos de AntDesign desde Expo


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

// Función asincrónica para obtener datos de la colección 'cities' de Firestore
const fetchCities = async (setCities) => {
  const citiesCollection = collection(db, 'cities');          // Obtiene una referencia a la colección 'cities' en Firestore
  const citySnapshot = await getDocs(citiesCollection);       // Obtiene una instantánea de los documentos en la colección 'cities'
  const cityList = citySnapshot.docs.map(doc => doc.data());  // Mapea los datos de los documentos en la instantánea a una matriz y extrae los datos de cada documento
  setCities(cityList);                                        // Actualiza el estado de las ciudades con la lista de datos obtenida de Firestore
};

// Se utiliza el componente ListScreen como una función que recibe las propiedades de navegación 
const ListScreen = ({ navigation }) => {
  // Estados para manejar los datos y la interfaz de usuario
  const [cities, setCities] = useState([]);                             // Lista de ciudades
  const [modalVisible, setModalVisible] = useState(false);              // Visibilidad del modal
  const [name, setName] = useState('');                                 // Nombre de la ciudad
  const [day, setDay] = useState('');                                   // Día
  const [accommodation, setAccommodation] = useState('');               // Alojamiento
  const [activities, setActivities] = useState([]);                     // Lista de actividades
  const [description, setDescription] = useState('');                   // Descripción
  const [mediaUrl, setMediaUrl] = useState('null');                     // URL del archivo multimedia (imagen o video)
  const [filterModalVisible, setFilterModalVisible] = useState(false);  // Visibilidad del modal de filtro
  const [cityFilter, setCityFilter] = useState('');                     // Filtro de ciudad
  const [selectedDay, setSelectedDay] = useState('');                   // Día seleccionado
  
  // Función para abrir el modal de filtro
  const openFilterModal = () => {
    setFilterModalVisible(true);
  };

  // Función para cerrar el modal de filtro
  const closeFilterModal = () => {
    setFilterModalVisible(false);
  };

  // Función para aplicar el filtro
  const applyFilter = () => {
    // Aquí podrías aplicar la lógica para filtrar las ciudades según los valores en cityFilter y selectedDay
    // Por ejemplo, podrías tener una función que filtre las ciudades y actualice la lista de ciudades mostradas
    // fetchFilteredCities(cityFilter, selectedDay);
    setCityFilter('');
    setSelectedDay('');
    setFilterModalVisible(false);
  };

  // Efecto para obtener los datos de la colección 'cities' de Firestore
  useEffect(() => {
    fetchCities(setCities);
  }, []);


  // Funccion para selecionar un video o una imagen ***********************************************************************************************************************************
  const selectMedia = async (mediaType) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission denied');
        return;
      }

      let mediaOptions = {
        mediaTypes: mediaType === 'video' ? ImagePicker.MediaTypeOptions.Videos : ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      };

      const result = await ImagePicker.launchImageLibraryAsync(mediaOptions);

      if (!result.cancelled) {
        const mediaUri = result.uri;
        console.log('Selected media URI:', mediaUri);
      }
    } catch (error) {
      console.log('Error selecting media:', error);
    }
  };

  // Función para subir un archivo multimedia (imagen o video) al Storage de Firebase *************************************************************************************************
  const uploadMedia = async (uri, fileName) => {
    const storage = getStorage(app);                      // Obtiene una referencia al almacenamiento de Firebase
    const storageRef = ref(storage, fileName);            // Crea una referencia al archivo en el almacenamiento de Firebase
    await uploadBytes(storageRef, uri);                   // Sube el archivo al almacenamiento de Firebase

    // Obtiene la URL del archivo subido
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;                                   // Devuelve la URL del archivo subido
  };
  
  // Función asincrona para agregar los detalles de una ciudad a la BBDD **************************************************************************************************************
  const addCityDetails = async () => {
    let uploadedMediaUrl = '';
    if (mediaUrl) {
      // Si hay un archivo multimedia (imagen o video) seleccionado, súbelo al Storage de Firebase
      uploadedMediaUrl = await uploadMedia(mediaUrl, 'media'); // 'media' es el nombre que recibirá el archivo en el Storage
    }
    const citiesCollection = collection(db, 'cities');     // Colección de ciudades en la base de datos
    const newCityData = {                                  // Objeto con los detalles de la nueva ciudad a agregar
      name,
      day,
      accommodation,
      activities,
      description,
      mediaUrl: uploadedMediaUrl,
    };
    // Agrega el objeto newCityData a la colección citiesCollection en la base de datos
    await addDoc(citiesCollection, newCityData);
    
    // Limpia los campos de entrada y cierra el modal
    setModalVisible(false);
    setName('');
    setDay('');
    setAccommodation('');
    setActivities('');
    setDescription('');
    setMediaUrl('');
    
    // Actualiza la lista de ciudades mostradas llamando a la función fetchCities
    fetchCities(setCities);
  };

  // Navega hacia la pantalla de detalles cuando se selecciona una ciudad
  const navigateToDetail = (cityName) => {
    // Utiliza la navegación para ir a la pantalla 'DetailScreen' y pasa el nombre de la ciudad como parámetro
    navigation.navigate('DetailScreen', { city: cityName });
  };

  // Abre el modal para agregar detalles de una nueva ciudad
  const openModal = () => {
    // Establece la visibilidad del modal en 'true' para mostrarlo en la interfaz
    setModalVisible(true);
  };

  // Cierra el modal para agregar detalles de una nueva ciudad
  const closeModal = () => {
    // Establece la visibilidad del modal en 'false' para ocultarlo en la interfaz
    setModalVisible(false);
  };

  // Elimina una ciudad de la base de datos
  const deleteCity = async (cityName) => {
    const citiesCollection = collection(db, 'cities');          // Accede a la colección de ciudades en Firestore
    const cityQuery = query(citiesCollection);                  // Realiza una consulta para obtener todas las ciudades
    const citySnapshot = await getDocs(cityQuery);              // Obtiene una instantánea de las ciudades
    
    // Itera sobre las ciudades en la instantánea
    citySnapshot.forEach(async (doc) => {
        // Comprueba si el nombre de la ciudad coincide con el nombre proporcionado
        if (doc.data().name === cityName) {
            const docRef = doc.ref;                             // Obtiene la referencia al documento
            await deleteDoc(docRef);                            // Elimina el documento usando la referencia
        }
    });

    // Actualiza la lista de ciudades mostradas llamando a la función fetchCities
    fetchCities(setCities);

    // Muestra un mensaje de alerta al usuario indicando que la ciudad ha sido eliminada
    alert('Ciudad eliminada');
  };

  return (
    // Vista principal del componente
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        {/* Botón para abrir el modal para agregar una nueva ciudad */}
        <Button onPress={openModal} title="Agregar ciudad" />

        {/* Lista de ciudades */}
        <FlatList
            data={cities}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
                // Vista de cada ciudad en la lista
                <View style={styles.cityContainer}>
                    {/* Título de la ciudad, al presionarlo navega a la pantalla de detalles */}
                    <TouchableOpacity onPress={() => navigateToDetail(item.name)}>
                        <Text style={styles.cityText}>{item.name}</Text>
                    </TouchableOpacity>

                    {/* Botón para eliminar la ciudad */}
                    <TouchableOpacity onPress={() => deleteCity(item.name)}>
                        <AntDesign name="delete" size={24} color="black" />
                    </TouchableOpacity>
                </View>
            )}
        />

        {/* Modal para agregar una nueva ciudad */}
        <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={closeModal}
        >
            <View style={styles.modalContainer}>
                {/* Campos para agregar detalles de la nueva ciudad */}
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
                    onChangeText={text => setActivities(text)}
                    value={activities}
                    placeholder="Actividades"
                />
                <TextInput
                    style={styles.descriptionInput}
                    onChangeText={text => setDescription(text)}
                    value={description}
                    placeholder="Descripción"
                    multiline={true} 
                />
                
                <Button onPress={selectMedia} title="Seleccione un archivo" />

                {/* Botón para guardar los detalles de la nueva ciudad */}
                <Button onPress={addCityDetails} title="Guardar detalles" />
                {/* Botón para cerrar el modal */}
                <Button onPress={closeModal} title="Cerrar" />
            </View>
        </Modal>

        {/* Botón para abrir el modal de filtro */}
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

export default ListScreen;
