// Importa las dependencias necesarias desde React y React Navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importa los componentes de las diferentes pantallas
import DetailScreen from './screens/DetailScreen';
import ListScreen from './screens/ListScreen';
import InicioScreen from './screens/InicioScreen';
import PlayerScreen from './screens/PlayerScreen';

// Crea un Stack Navigator para manejar la navegación
const Stack = createStackNavigator();

// Componente principal de la aplicación
const App = () => {
  // Retorna la estructura de navegación de la aplicación
  return (
    // Contenedor de navegación principal
    <NavigationContainer>
      {/* Define el Stack Navigator con opciones de estilo */}
      <Stack.Navigator
        initialRouteName="VIAJE A JAPÓN" 
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e', 
          },
          headerTintColor: '#fff', 
          headerTitleStyle: {
            fontWeight: 'bold', 
            fontSize: '28px', 
          },
          headerTitleAlign: 'center', 
        }}
      >
        {/* Define las diferentes pantallas y sus opciones */}
        <Stack.Screen name="VIAJE A JAPÓN" component={InicioScreen} options={{ title: 'VIAJE A JAPÓN' }} />
        <Stack.Screen name="Listado" component={ListScreen} options={{ title: 'Listado' }} />
        <Stack.Screen name="Detalles" component={DetailScreen} options={{ title: 'Detalles' }} />
        <Stack.Screen name="Video" component={PlayerScreen} options={{ title: 'Video' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// Exporta el componente principal de la aplicación
export default App;