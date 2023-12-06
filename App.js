
// Importa las dependencias necesarias desde React y React Navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
// Importa los componentes de las diferentes pantallas
import DetailScreen from './src/screens/DetailScreen';
import ListScreen from './src/screens/ListScreen';
import PlayerScreen from './src/screens/PlayerScreen';

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
        initialRouteName="VIAJE A JAPÓN" // Define la ruta inicial
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e', // Color de fondo del encabezado
            textAlign: 'center', // Alineación del texto en el encabezado
          },
          headerTintColor: '#fff', // Color del texto/iconos del encabezado
          headerTitleStyle: {
            fontWeight: 'bold', // Estilo del texto del encabezado
            fontSize: '28px', // Tamaño de la fuente del texto del encabezado
          },
          headerTitleAlign: 'center', // Alineación central del título del encabezado
        }}
      >

      {/* Define las diferentes pantallas y sus opciones */}
      <Stack.Screen name="VIAJE A JAPÓN" component={ListScreen} options={{ title: 'VIAJE A JAPÓN' }} />
      <Stack.Screen name="DetailScreen" component={DetailScreen} options={{ title: 'Detalles' }} />
        <Stack.Screen name="Video" component={PlayerScreen} options={{ title: 'Video' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
// Exporta el componente principal de la aplicación
export default App;