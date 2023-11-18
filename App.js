import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import DetailScreen from './screens/DetailScreen';
import ListScreen from './screens/ListScreen';
import InicioScreen from './screens/InicioScreen';
import PlayerScreen from './screens/PlayerScreen';

const Stack = createStackNavigator();

const App = () => {

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="VIAJE A JAPÓN"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e', // Cambia esto al color que desees
          },
          headerTintColor: '#fff', // Cambia esto al color que desees para los iconos/texto
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >

      <Stack.Screen name="VIAJE A JAPÓN" component={InicioScreen} options={{ title: 'VIAJE A JAPÓN' }} />
        <Stack.Screen name="Listado" component={ListScreen} options={{ title: 'Listado' }} />
        <Stack.Screen name="Detalles" component={DetailScreen} options={{ title: 'Detalles' }} />
        <Stack.Screen name="Video" component={PlayerScreen} options={{ title: 'Video' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
  
};

export default App;