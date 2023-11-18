import React from 'react';
import { View, Text, Button } from 'react-native';

const PlayerScreen = ({ videoUrl }) => {
  const reproducirVideo = () => {
    // Lógica para reproducir el video
    // Puedes utilizar librerías como react-native-video
  };

  return (
    <View>
      <Text>Video Component</Text>
      <Button title="Reproducir Video" onPress={reproducirVideo} />
      {/* Otros elementos para mostrar el video */}
    </View>
  );
};

export default PlayerScreen;
