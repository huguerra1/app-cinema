import React, { Component } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MyOrdersScreen from './src/screens/MyOrdersScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import HomeScreen from './src/screens/HomeScreen';
import CatalogScreen from './src/screens/CatalogScreen'; 
import BuyTicketScreen from './src/screens/BuyTicketScreen';
import CartScreen from './src/screens/CartScreen';
import SnacksScreen from './src/screens/SnacksScreen';

const Stack = createNativeStackNavigator();

export default class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="BuyTicket" component={BuyTicketScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MyOrders" component={MyOrdersScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Cart" component={CartScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Snacks" component={SnacksScreen} options={{ headerShown: false }} />
         
          
          {/* Adicione a tela de Catálogo */}
          <Stack.Screen name="Catalog" component={CatalogScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}