import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/header';

interface HomeScreenProps {
  navigation?: any;
}

export default class HomeScreen extends Component<HomeScreenProps> {
  
  handleLogout = async () => {
    await AsyncStorage.removeItem('@jwt_token');
    this.props.navigation.replace('Login');
  }

  emBreve = (sessao: string) => {
    Alert.alert('Em construção', `A tela de ${sessao} será desenvolvida em breve!`);
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Menu Principal" />

        <View style={styles.body}>
          <Text style={styles.welcomeText}>O que você deseja fazer?</Text>

          <View style={styles.gridContainer}>
            
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => this.props.navigation.navigate('Catalog')}
            >
              <Text style={styles.cardIcon}>🎬</Text>
              <Text style={styles.cardTitle}>Lista de Filmes</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.card} 
              onPress={() => this.props.navigation.navigate('BuyTicket')}
            >
              <Text style={styles.cardIcon}>🎟️</Text>
              <Text style={styles.cardTitle}>Comprar Ingressos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.card} 
              onPress={() => this.props.navigation.navigate('MyOrders')}
            >
              <Text style={styles.cardIcon}>🧾</Text>
              <Text style={styles.cardTitle}>Meus Pedidos</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.card} 
              onPress={() => this.props.navigation.navigate('Snacks')}            >
              <Text style={styles.cardIcon}>🍿</Text>
              <Text style={styles.cardTitle}>Bomboniere</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => this.props.navigation.navigate('Cart')}
            >
              <Text style={styles.cardIcon}>🛒</Text>
              <Text style={styles.cardTitle}>Meu Carrinho</Text>
            </TouchableOpacity>

          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={this.handleLogout}>
            <Text style={styles.logoutText}>Sair da Conta</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1A24',
  },
  body: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  welcomeText: {
    color: '#E5DDF0',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  gridContainer: {
    width: '100%',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#30293B',
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4A3E5C',
    elevation: 4,
  },
  cardIcon: {
    fontSize: 40,
    marginBottom: 10,
  },
  cardTitle: {
    color: '#D1C4E9',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  logoutBtn: {
    backgroundColor: '#8B0000',
    width: '100%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 10,
  },
  logoutText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});
