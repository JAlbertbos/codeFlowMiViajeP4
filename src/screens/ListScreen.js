
// Importa los módulos necesarios desde React y React Native
import React, { useState, useEffect } from 'react';
import { View, Button, FlatList, Text, TouchableOpacity, Modal, Image, TextInput, StyleSheet, Platform } from 'react-native';
import ImagePickerReact from 'react-native-image-picker';
import * as ImagePicker from 'expo-image-picker';
// Importa funciones específicas de Firestore
import { getFirestore, collection, addDoc, query, getDocs, deleteDoc } from 'firebase/firestore/lite';
import { initializeApp } from 'firebase/app';                                                                 // Importa la función de inicialización de Firebase
import { getStorage, ref, uploadBytes, getDownloadURL } from '@firebase/storage';                                            // Importa funciones específicas de Firebase Storage
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
  const [activities, setActivities] = useState('');                     // Lista de actividades
  const [description, setDescription] = useState('');                   // Descripción
  const [mediaUrl, setMediaUrl] = useState(null);                       // URL del archivo multimedia (imagen o video)
  const [filterModalVisible, setFilterModalVisible] = useState(false);  // Visibilidad del modal de filtro
  const [cityFilter, setCityFilter] = useState('');                     // Filtro de ciudad
  const [selectedDay, setSelectedDay] = useState('');                   // Día seleccionado
  const [image, setImage] = useState(null);                             // Previsualización de la imagen 
  const [mediaUri, setMediaUri] = useState(null);                       // Identificador del archivo multimedia
  const [mediaFileName, setMediaFileName] = useState(null);             // Nombre para el archivo multimedia

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

  // Ordena las ciudades por el número de día
  const sortedCities = [...cities].sort((a, b) => a.day - b.day);
  
  // Funccion para selecionar un video o una imagen ***********************************************************************************************************************************
  const selectMedia = async () => {
  // Selecciona un archivo multimedia de la biblioteca
  let result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,     // Tipos de medios disponibles (todos en este caso)
    allowsEditing: true,                              // Permite editar la imagen seleccionada
    aspect: [4, 3],                                   // Proporción de aspecto (4:3 en este caso)
    quality: 1,                                       // Calidad de la imagen (de 0 a 1)
    });

    if (!result.canceled && result.assets[0].uri) {
      // Establece la URI seleccionada en el estado (por ejemplo, para mostrarla en la interfaz)
      setImage(result.assets[0].uri);
      if (result.assets[0].uri.startsWith('data:image/')) {
        console.log('Es una imagen');
        const fileName = `images/${new Date().toISOString()}_${result.assets[0].uri.split('/').pop()}`;   // Genera un nombre de archivo único para la imagen con la ultima parte del uri
        
        // Actualizar el estado con la uri y el nombre del archivo
        setMediaUri(result.assets[0].uri);
        setMediaFileName(fileName);
        console.log(fileName);

      } else if (result.assets[0].uri.startsWith('data:video/')) {
        console.log('Es un video');
        const fileName = `videos/${new Date().toISOString()}_${result.assets[0].uri.split('/').pop()}`;   // Genera un nombre de archivo único para la imagen con la ultima parte del uri
        
        // Actualizar el estado con la uri y el nombre del archivo
        setMediaUri(result.assets[0].uri);
        setMediaFileName(fileName);
        console.log(fileName);

      } else {
        // Otro tipo de archivo 
        console.log('Otro tipo de archivo');
      }
    }  
  };

  // Función para subir un archivo multimedia (imagen o video) al Storage de Firebase *************************************************************************************************
  const uploadMedia = async (uri, fileName) => {
    const response = await fetch(uri);                    // Obtiene el archivo desde la URI
    const blob = await response.blob();                   // Convierte el URI en un objeto Blob
    const storage = getStorage(app);                      // Obtiene una referencia al almacenamiento de Firebase
    const storageRef = ref(storage, fileName);            // Crea una referencia al archivo en el almacenamiento de Firebase
    await uploadBytes(storageRef, blob);                  // Sube el Blob al almacenamiento de Firebase
    const downloadURL = await getDownloadURL(storageRef); // Obtiene la URL del archivo subido
    return downloadURL;                                   // Devuelve la URL del archivo subido
  };
  
  // Función asincrona para agregar los detalles de una ciudad a la BBDD **************************************************************************************************************
  const addCityDetails = async () => {
    let url = '';

    if (!name || !day || !accommodation || !activities || !description) {
      // Si falta algún campo, no continuar y mostrar un mensaje de error o manejarlo según necesites
      alert('Por favor, completa todos los campos');
      return;
    }
    
    // Subir la imagen o video antes de agregar la información de la ciudad
    if (mediaUri && mediaFileName) {
      const downloadURL = await uploadMedia(mediaUri, mediaFileName);
      setMediaFileName(null);     // Limpiar el estado de mediaFileName
      setMediaUri(null);          // Limpiar el estado de mediaUri
      console.log(downloadURL);
      url = downloadURL;
    }
    const citiesCollection = collection(db, 'cities');     // Colección de ciudades en la base de datos
    const newCityData = {                                  // Objeto con los detalles de la nueva ciudad a agregar
      name,
      day,
      accommodation,
      activities,
      description,
      mediaUrl: url,
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
    setImage(null);
    
    // Actualiza la lista de ciudades mostradas llamando a la función fetchCities
    fetchCities(setCities);
  };

  const navigateToDetail = (item) => {
    navigation.navigate('DetailScreen', { item });
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

  // Restablecer los campos del modal
  const resetFields = () => {
    setName('');
    setDay('');
    setAccommodation('');
    setActivities('');
    setDescription('');
    setMediaUri(null);
    setMediaFileName(null);
    setImage(null);
  };

  return (
    // Vista principal del componente
    <View style={{ flex: 1, flexDirection: 'row', margin: 30 }}>
      
      {/* Columna Izquierda */}
      <View style={{ flex: 1, alignItems: 'left' }}>
        <TouchableOpacity onPress={openModal} style={styles.button}>
          <Text style={styles.buttonText}>Agregar ciudad</Text>
        </TouchableOpacity>

        <FlatList
          data={sortedCities}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={{ marginTop: 10, height: 45 }}>
              <TouchableOpacity onPress={() => navigateToDetail(item)}>
                <Text style={styles.cityText}>Día {item.day} - {item.name}</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>

      {/* Columna Derecha */}
      <View style={{ flex: 1, alignItems: 'center'}}>
        <TouchableOpacity onPress={openFilterModal} style={styles.button}>
          <Text style={styles.buttonText}>Filtrar ciudad</Text>
        </TouchableOpacity>

        {/* Botón de editar y eliminar */}
          {sortedCities.map((item, index) => (
            <View style={{ flexDirection: 'row', marginTop: 10, height: 45 }}>
              <TouchableOpacity onPress={() => navigateToDetail(item)}>
                <AntDesign name="edit" size={23} color="black" style={{ marginTop: 3,  marginRight: 40}} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => deleteCity(item.name)} key={index}  >
                <AntDesign name="delete" size={23} color="black"  style={{ marginTop: 3, marginLeft: 40 }}/>
              </TouchableOpacity>
            </View>
          ))}
        
        {/* Contenido del modal de filtro */}
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

      {/* Modal para agregar una nueva ciudad */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
        >
        <View style={styles.modalContainer}>
          {/* Botón para cerrar el modal */}
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <AntDesign name="close" size={20} color="white" />
          </TouchableOpacity>
          
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

          {/* Botón para seleccionar un archivo */}
          <TouchableOpacity onPress={selectMedia} style={[styles.buttonModal, { marginBottom: 10 }]}>
            <Text style={styles.buttonText}>Seleccionar archivo</Text>
          </TouchableOpacity>
          {mediaUri && mediaUri.startsWith('data:image/') && (
            <Image source={{ uri: mediaUri }} style={{ width: 180, height: 150 }} />                        // Imagen previsualizada que se quiere subir
          )}
          {mediaUri && mediaUri.startsWith('data:video/') && (
            <Image source={require('../../assets/video2.jpg')} style={{ width: 180, height: 150 }} />     // Imagen predetermianda para los videos
          )}

          {/* Botón para guardar los detalles de la nueva ciudad */}
          <TouchableOpacity onPress={addCityDetails} style={[styles.buttonModal, { marginTop: 10 }]}>
            <Text style={styles.buttonText}>Guardar registro </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={resetFields} style={[styles.buttonModal, { position: 'absolute', bottom: 20 }]}>
            <Text style={styles.buttonText}>Restablecer</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  cityContainer: {
    marginTop: 30,
  },
  cityText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginVertical: 5, 
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
    height: 100, 
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    width: 200,
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    textAlignVertical: 'top',
  },
  button: {
    width: 140,
    backgroundColor: '#565656', 
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
    margin: 5,
    marginBottom: 35,
  },
  buttonModal: {
    width: 200,
    backgroundColor: '#565656', 
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderRadius: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: 'red',
    borderRadius: 20,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontWeight: '500'
  },
});

export default ListScreen;
