// Importa las dependencias necesarias desde React y React Navigation
import { useState, useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AntDesign } from '@expo/vector-icons'; 
// Importa los componentes de las diferentes pantallas
import DetailScreen from './src/screens/DetailScreen';
import ListScreen from './src/screens/ListScreen';
import PlayerScreen from './src/screens/PlayerScreen';

import { Text, View, Button, Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import {PermissionsAndroid} from 'react-native';

import messaging from '@react-native-firebase/messaging';
  
// Crea un Stack Navigator para manejar la navegación
const Stack = createStackNavigator();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


// Componente principal de la aplicación
const App = () => {

  // Expo notifications ------------------------------------------------------------------------
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  // Expo notifications ------------------------------------------------------------------------

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
      <View style={{ position: 'absolute', bottom: 10, left: 10 }}>
        <Button
          title="X"
          onPress={async () => {
            await schedulePushNotification();
          }}
        />
      </View>
    </NavigationContainer>
  );
};

// Expo notifications ------------------------------------------------------------------------
async function schedulePushNotification() {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail!",
      body: 'Here is the notification body',
      data: { data: 'goes here' },
    },
    trigger: { seconds: 2 },
  });
}
async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    // Learn more about projectId:
    // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    alert('Must use physical device for Push Notifications');
  }
  return token;
}
// Expo notifications ------------------------------------------------------------------------
export default App;