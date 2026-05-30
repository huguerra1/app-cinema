import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Header from '../components/header';
import api from '../services/api';

interface RegisterScreenProps {
  navigation?: any;
}

interface RegisterState {
  nome: string; 
  email: string;
  senha: string;
}

export default class RegisterScreen extends Component<RegisterScreenProps, RegisterState> {
  constructor(props: RegisterScreenProps) {
    super(props);
    this.state = {
      nome: '',
      email: '',
      senha: '',
    };
  }

  handleRegister = async () => {
    const { nome, email, senha } = this.state;
    
    if (!nome || !email || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }

    // 1. RASTREADOR: Imprime a URL que o Axios montou
    console.log('\n--- INICIANDO REQUISIÇÃO ---');
    console.log('🔗 URL Base do Axios:', api.defaults.baseURL);
    console.log('📤 Dados enviados:', { name: nome, email, password: senha });

    try {
      const response = await api.post('/users', {
        name: nome,
        email: email,
        password: senha
      });

      console.log('✅ SUCESSO! Resposta do servidor:', response.data);
      Alert.alert('Sucesso', 'Conta criada com sucesso! Faça login.');
      this.props.navigation.navigate('Login');

    } catch (error: any) {
      // 2. RASTREADOR: Desmonta o erro escondido do Axios
      console.log('❌ FALHA NA REQUISIÇÃO!');
      
      if (error.response) {
        console.log('Status do Servidor:', error.response.status);
        console.log('Erro do Servidor:', error.response.data);
      } else if (error.request) {
        console.log('O Servidor não respondeu. A requisição foi feita para esta URL:', error.config.url);
      } else {
        console.log('Erro interno do app:', error.message);
      }
      
      Alert.alert('Erro', 'Verifique o terminal do PC para ver o motivo da falha.');
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="Nova Conta" />

        {/* Usamos ScrollView caso a tela do celular seja pequena e o teclado cubra os botões */}
        <ScrollView contentContainerStyle={styles.body}>
          
          <View style={styles.iconContainer}>
            <Text style={styles.emojiGiant}>🎟️</Text>
            <Text style={styles.welcomeText}>Junte-se ao Clube</Text>
          </View>

          <Text style={styles.label}>Nome Completo:</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: João da Silva"
            placeholderTextColor="#8B7E9C"
            value={this.state.nome}
            onChangeText={(text) => this.setState({ nome: text })}
          />

          <Text style={styles.label}>E-mail:</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu e-mail"
            placeholderTextColor="#8B7E9C"
            value={this.state.email}
            onChangeText={(text) => this.setState({ email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Senha:</Text>
          <TextInput
            style={styles.input}
            placeholder="Crie uma senha forte"
            placeholderTextColor="#8B7E9C"
            value={this.state.senha}
            onChangeText={(text) => this.setState({ senha: text })}
            secureTextEntry={true}
          />

          <TouchableOpacity style={styles.button} onPress={this.handleRegister}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => this.props.navigation.navigate('Login')}
          >
            <Text style={styles.backText}>Já tem uma conta? Faça Login</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    );
  }
}

// Mesma paleta de cores elegante
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1E1A24',
  },
  body: {
    padding: 24,
    flexGrow: 1,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  emojiGiant: {
    fontSize: 50,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#E5DDF0',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#D1C4E9',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#30293B',
    borderWidth: 1,
    borderColor: '#4A3E5C',
    color: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6C5B7B',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    elevation: 3,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  backBtn: {
    marginTop: 25,
    alignItems: 'center',
    padding: 10,
  },
  backText: {
    color: '#BFA8D1',
    fontSize: 15,
  },
});