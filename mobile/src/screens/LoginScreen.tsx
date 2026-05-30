import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/header';
import api from '../services/api';

interface LoginScreenProps {
  navigation?: any; 
}

interface LoginState {
  email: string;
  senha: string;
}

export default class LoginScreen extends Component<LoginScreenProps, LoginState> {
  constructor(props: LoginScreenProps) {
    super(props);
    this.state = {
      email: '',
      senha: '',
    };
  }

  handleLogin = async () => {
    const { email, senha } = this.state;
    
    if (!email || !senha) {
      Alert.alert('Atenção', 'Preencha seu e-mail e senha!');
      return;
    }

    try {
      // Dispara a requisição usando a nossa configuração do api.ts
      const response = await api.post('/users/login', {
        email: email,
        password: senha
      });

      // Salva o JWT no cofre do celular
      const token = response.data.access_token;
      await AsyncStorage.setItem('@jwt_token', token);
      await AsyncStorage.setItem('@user_id', response.data.user.id);
      
      
      // Redireciona para a Home e impede de voltar para o Login pelo botão de voltar
      this.props.navigation.replace('Home');

    } catch (error: any) {
      console.log(error);
      Alert.alert('Erro', 'E-mail ou senha inválidos, ou falha de conexão!');
    }
  }

  handleRecuperarSenha = () => {
    if (!this.state.email) {
      Alert.alert('Recuperação', 'Por favor, digite seu e-mail no campo acima para recuperar a senha.');
      return;
    }
    Alert.alert('Email Enviado!', `As instruções foram enviadas para:\n${this.state.email}`);
  }

  render() {
    return (
      <View style={styles.container}>
        <Header title="CineGestão" />

        <View style={styles.body}>
          <View style={styles.welcomeContainer}>
            <Text style={styles.emojiGiant}>🎥🍿</Text>
            <Text style={styles.welcomeText}>Bem-vindo ao seu Cinema</Text>
            <Text style={styles.subText}>Faça login para acessar o catálogo</Text>
          </View>

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
            placeholder="Digite sua senha"
            placeholderTextColor="#8B7E9C"
            value={this.state.senha}
            onChangeText={(text) => this.setState({ senha: text })}
            secureTextEntry={true}
          />

          <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
            <Text style={styles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.forgotBtn} onPress={this.handleRecuperarSenha}>
            <Text style={styles.forgotText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.registerBtn} 
            onPress={() => this.props.navigation.navigate('Register')}
          >
            <Text style={styles.registerText}>
              Ainda não tem conta? Cadastre-se
            </Text>
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
    padding: 24,
    flex: 1,
    justifyContent: 'center',
  },
  welcomeContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emojiGiant: {
    fontSize: 60,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E5DDF0',
  },
  subText: {
    fontSize: 14,
    color: '#A395B8',
    marginTop: 5,
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
  forgotBtn: {
    marginTop: 20,
    alignItems: 'center',
    padding: 10,
  },
  forgotText: {
    color: '#BFA8D1',
    fontSize: 15,
    textDecorationLine: 'underline',
  },
  registerBtn: {
    marginTop: 10,
    alignItems: 'center',
  },
  registerText: {
    color: '#E5DDF0',
    fontSize: 15,
    fontWeight: 'bold',
  }
});