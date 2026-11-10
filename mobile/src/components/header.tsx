import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface HeaderProps {
  title: string;
}

export default class Header extends Component<HeaderProps> {
  render() {
    return (
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>🍿 {this.props.title} 🎬</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 90,
    paddingTop: 30,
    backgroundColor: '#2A2431',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#3E3548',
    elevation: 5,
  },
  headerText: {
    color: '#E5DDF0',
    fontSize: 22,
    fontWeight: 'bold',
  },
});
