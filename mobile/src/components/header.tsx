import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
  title: string;
}

export default class Header extends Component<HeaderProps> {
  render() {
    return (
      <View style={styles.headerContainer}>
        {/* Adicionando os emojis no título */}
        <Text style={styles.headerText}>🍿 {this.props.title} 🎬</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 90, // Um pouco maior para dar respiro
    paddingTop: 30, // Espaço para a barra de status do celular
    backgroundColor: '#2A2431', // Roxo super escuro e acinzentado
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3E3548', // Bordinha sutil
    elevation: 5,
  },
  headerText: {
    color: '#E5DDF0', // Branco arroxeado
    fontSize: 22,
    fontWeight: 'bold',
  },
});