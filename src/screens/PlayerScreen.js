import React, { useState, useEffect } from 'react';
import { ScrollView, View, Platform, Text, Modal, TextInput, StyleSheet, TouchableOpacity, Dimensions} from 'react-native';
import { getFirestore, c } from 'firebase/firestore/lite';
import { initializeApp } from 'firebase/app';
import { Video, ResizeMode  } from 'expo-av';
import { FontAwesome } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

     

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

const app = initializeApp(firebaseConfig);                // Inicializa la aplicación Firebase con la configuración proporcionada
const db = getFirestore(app);                             // Obtiene una referencia a la base de datos Firestore

const PlayerScreen = ({ route }) => {
  const { mediaUrl } = route.params;
  const [videoURL, setVideoURL] = useState(null);
  const [volume, setVolume] = useState(1);
  const [status, setStatus] = useState({});

  useEffect(() => {
    if (mediaUrl) {
      setVideoURL(mediaUrl);  // Si mediaUrl no es nulo, configúralo como videoURL.
    }
  }, [mediaUrl]);

  const handleVolumeChange = (value) => {
    setVolume(value);
  };

  const handleVideoEnd = () => {
    setVideoEnd(true);
  };


  if (Platform.OS === 'web') {
    return (
      <View style={[ styles.containerWeb , {} ]}>
        <video src={videoURL} {
          ...{
            controls: true,
            autoPlay: false,
            onEnded: handleVideoEnd,
            style: styles.videoWeb,
          }
      } />
    </View>
    )
  } else {
    return (
      <View style={styles.container}>
        {videoURL && (
          <View style={{backgroundColor: 'rgba(0, 0, 0, 0.7)'}}>
            <>
              <Video
                style={styles.video}
                source={{uri: videoURL,}}
                useNativeControls
                resizeMode={ResizeMode.COVER}
                onPlaybackStatusUpdate={status => setStatus(() => status)}
                volume={volume}
              />
              <View style={[styles.volumeControl, {marginTop: 10}]}>
                <Slider
                  style={styles.slider}
                  minimumValue={0}
                  maximumValue={1}
                  value={volume}
                  onValueChange={handleVolumeChange}
                  minimumTrackTintColor="#1E90FF"
                />
                <TouchableOpacity onPress={() => handleVolumeChange(volume === 0 ? 1 : 0)}>
                  <FontAwesome
                    name={volume === 0 ? 'volume-off' : volume < 0.5 ? 'volume-down' : 'volume-up'} size={26} color="white"
                  />
                </TouchableOpacity>
              </View>
            </>
          </View>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  containerWeb: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  video: {
    width: Dimensions.get("window").width * 1,
    height: Dimensions.get("window").width * 1 * (9 / 16),
  },
  slider: {
    flex: 1,
    marginRight: 3, 
    marginLeft: 250,
    maxWidth: 100,
  },
  volumeControl: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingRight: 15,
    marginBottom: 10,
  },
  videoWeb: {
    maxWidth: '100%', // Limita el ancho del video al tamaño máximo del contenedor
    maxHeight: '100%', // Limita la altura del video al tamaño máximo del contenedor
    width: 'auto', // Ancho automático para mantener la relación de aspecto original
    height: 'auto', // Altura automática para mantener la relación de aspecto original
  },
});

export default PlayerScreen;
