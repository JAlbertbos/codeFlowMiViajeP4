import React from 'react';
import { View, Text, Image } from 'react-native';

const DetailScreen = ({ detalles }) => {
  return (
    <View>
      <Text>Detalles Component</Text>
      {detalles.map((detalle, index) => (
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
