import React from 'react';
import { View, Text, Image } from 'react-native';

const DetailScreen = ({ route }) => {
  const { item } = route.params || {}; 
  // Verifica si 'detalles' existe y es un array antes de mapearlo
  return (
    <View>
      <Text>Detalles del Dia {item.day}</Text>
      <Text>Nombre: {item.name}</Text>
      <Text>Alojamiento: {item.accommodation}</Text>
      <Text>Descripción: {item.description}</Text>
    </View>
  );
};


export default DetailScreen;
