// Importa las dependencias necesarias desde React y React Navigation
import { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons'; 
// Importa los componentes de las diferentes pantallas
import DetailScreen from './src/screens/DetailScreen';
import ListScreen from './src/screens/ListScreen';
import PlayerScreen from './src/screens/PlayerScreen';

import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';

// Crea un Stack Navigator para manejar la navegación
const Stack = createStackNavigator();

// Componente principal de la aplicación
const App = () => {
  
  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => { 
    if(requestUserPermission()){
      messaging().getToken().then(token => {
        console.log("Token: " + token);
      });
    }
    // Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(async(remoteMessage) => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification,
          );
        }
      }); 
      
      // Assume a message-notification contains a "type" property in the data payload of the screen to open

    messaging().onNotificationOpenedApp(async(remoteMessage) => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification,
      );  
    });

    // Register background handler
    messaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('Message handled in the background!', remoteMessage);
    });

    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;

  }, []);



  const [documentData, setDocumentData] = useState(null);
  
  // Retorna la estructura de navegación de la aplicación
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="ListScreen"
        screenOptions={({ navigation }) => {
          // Componente para el botón de inicio
          const HomeButton = () => (
            <AntDesign
              name="home"
              size={24}
              color="white"
              style={{ marginRight: 15 }}
              onPress={() => navigation.navigate('ListScreen')}         // Navega a la pantalla principal al presionar el botón de inicio
            />
          );

          return {
            headerStyle: {
              backgroundColor: '#f4511e',                               // Estilo del encabezado: color de fondo
            },
            headerTintColor: '#fff',                                    // Estilo del encabezado: color del texto/iconos
            headerTitleStyle: {
              fontWeight: 'bold',                                       // Estilo del encabezado: peso del texto
            },
            headerTitleAlign: 'center',                                 // Estilo del encabezado: alineación del título
            headerRight: (props) => <HomeButton {...props} />,          // Componente de botón de inicio en la esquina superior derecha
          };
        }}
      >
        <Stack.Screen
          name="ListScreen"
          component={ListScreen}
          options={{ title: 'VIAJE A JAPÓN' }}
        />
        <Stack.Screen
          name="DetailScreen"
          component={DetailScreen}
          options={{ title: 'Detalles' }}
        />
        <Stack.Screen
          name="PlayerScreen"
          component={PlayerScreen}
          options={{ title: 'Video' }}
        />
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default App;