import { createNavigationContainerRef } from '@react-navigation/native';
import React, { useState } from 'react';
import { FlatList, Text, View, Button, Modal, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const InicioScreen = ({ data }) => {

  const app = useNavigation();

  const renderItem = ({ item }) => (
    <Text>{item.title}</Text>
    // Renderiza los elementos de la lista aquí
  );

  const handleGoToList = () => {
    app.navigate('Listado'); // 'Lista' es el nombre que le dimos a la pantalla ListScreen
  };

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [cityName, setCityName] = useState('');
  const [cities, setCities] = useState([]);

  const toggleModal = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <><FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()} /><Button title="Ir a Lista" onPress={handleGoToList} /></>

  );
};

export default InicioScreen;

