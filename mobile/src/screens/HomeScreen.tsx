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

  // Função temporária para os botões que ainda vamos desenvolver
  emBreve = (sessao: string) => {
    Alert.alert('Em construção', `A tela de ${sessao} será desenvolvida em breve!`);
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Menu Principal" />

        <View style={styles.body}>
          <Text style={styles.welcomeText}>O que você deseja fazer?</Text>

          {/* Container da Grade de Botões */}
          <View style={styles.gridContainer}>
            
            {/* Card 1: Lista de Filmes (Vai para o Catálogo real) */}
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => this.props.navigation.navigate('Catalog')}
            >
              <Text style={styles.cardIcon}>🎬</Text>
              <Text style={styles.cardTitle}>Lista de Filmes</Text>
            </TouchableOpacity>

            {/* Card 2: Comprar Ingressos */}
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => this.props.navigation.navigate('BuyTicket')}
            >
              <Text style={styles.cardIcon}>🎟️</Text>
              <Text style={styles.cardTitle}>Comprar Ingressos</Text>
            </TouchableOpacity>

            {/* Card 3: Meus Pedidos */}
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => this.props.navigation.navigate('MyOrders')}
            >
              <Text style={styles.cardIcon}>🧾</Text>
              <Text style={styles.cardTitle}>Meus Pedidos</Text>
            </TouchableOpacity>

            {/* Card 4: Lanches */}
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => this.props.navigation.navigate('Snacks')}            >
              <Text style={styles.cardIcon}>🍿</Text>
              <Text style={styles.cardTitle}>Bomboniere</Text>
            </TouchableOpacity>
            
            {/* Card Extra: Carrinho */}
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
    justifyContent: 'space-between', // Espalha os cards
  },
  card: {
    backgroundColor: '#30293B',
    width: '48%', // Quase metade da tela para caberem 2 por linha com um espacinho no meio
    aspectRatio: 1, // Deixa o card perfeitamente quadrado
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4A3E5C',
    elevation: 4, // Sombra no Android
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
    marginTop: 'auto', // Empurra o botão pro final da tela
    marginBottom: 10,
  },
  logoutText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  }
});