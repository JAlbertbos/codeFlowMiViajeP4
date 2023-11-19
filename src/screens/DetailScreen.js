import React from 'react';
import { View, Text, Image } from 'react-native';

const DetailScreen = ({ route }) => {
  const { detalles } = route.params || {}; // Asegúrate de que 'detalles' tenga un valor predeterminado

  // Verifica si 'detalles' existe y es un array antes de mapearlo
  return (
    <View>
      <Text>Detalles Component</Text>
      {detalles && Array.isArray(detalles) && detalles.map((detalle, index) => (
        <View key={index}>
          <Image source={{ uri: detalle.imagen }} style={{ width: 200, height: 200 }} />
          <Text>{detalle.titulo}</Text>
          {/* Otros elementos para mostrar detalles */}
        </View>
      ))}
    </View>
  );
};


export default DetailScreen;
