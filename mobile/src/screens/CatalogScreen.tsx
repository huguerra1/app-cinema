import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';
import Header from '../components/header';

interface CatalogScreenProps {
  navigation?: any;
}

interface CatalogState {
  filmes: any[];
  loading: boolean;
}

export default class CatalogScreen extends Component<CatalogScreenProps, CatalogState> {
  constructor(props: CatalogScreenProps) {
    super(props);
    this.state = {
      filmes: [],
      loading: true,
    };
  }

  async componentDidMount() {
    await this.carregarCatalogo();
  }

  carregarCatalogo = async () => {
    try {
      const token = await AsyncStorage.getItem('@jwt_token');
      const response = await api.get('/movie', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      this.setState({ filmes: response.data, loading: false });
    } catch (error: any) {
      console.log('Erro ao buscar dados:', error);
      this.setState({ loading: false });
    }
  }

  renderItem = ({ item }: { item: any }) => {
    const titulo = item.title || item.nome || item.name || 'Filme sem nome';
    let genero = 'Sem categoria';
    
    if (typeof item.genre === 'string') {
      genero = item.genre;
    } else if (item.genre && item.genre.name) { 
      genero = item.genre.name;
    } else if (item.genero && item.genero.name) {
      genero = item.genero.name;
    }

    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{titulo}</Text>
        <Text style={styles.cardSub}>Gênero: {genero}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Header title="Catálogo" />

        <View style={styles.body}>
          {/* NOVO: Botão de voltar para o Menu */}
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={styles.backBtnText}>⬅ Voltar para o Menu</Text>
          </TouchableOpacity>

          {this.state.loading ? (
            <ActivityIndicator size="large" color="#BFA8D1" style={{ marginTop: 50 }} />
          ) : (
            <FlatList
              data={this.state.filmes}
              keyExtractor={(item, index) => index.toString()}
              renderItem={this.renderItem}
              ListEmptyComponent={<Text style={styles.emptyText}>Nenhum filme encontrado no servidor.</Text>}
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1A24' },
  body: { flex: 1, padding: 20 },
  
  // Estilo do novo botão de voltar
  backBtn: {
    backgroundColor: '#30293B',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#4A3E5C',
  },
  backBtnText: {
    color: '#D1C4E9',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  card: {
    backgroundColor: '#30293B',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#4A3E5C',
  },
  cardTitle: { color: '#E5DDF0', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  cardSub: { color: '#A395B8', fontSize: 14 },
  emptyText: { color: '#D1C4E9', textAlign: 'center', marginTop: 40, fontSize: 16 },
});