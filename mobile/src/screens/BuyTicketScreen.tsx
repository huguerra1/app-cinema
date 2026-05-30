import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import Header from '../components/header';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BuyTicketScreenProps {
  navigation?: any;
}

interface BuyTicketState {
  sessoes: any[];
  sessaoSelecionada: string | null;
  loadingDados: boolean;
  loadingCompra: boolean;
}

export default class BuyTicketScreen extends Component<BuyTicketScreenProps, BuyTicketState> {
  constructor(props: BuyTicketScreenProps) {
    super(props);
    this.state = {
      sessoes: [],
      sessaoSelecionada: null, // Guarda o ID da sessão que o usuário clicar
      loadingDados: true,
      loadingCompra: false,
    };
  }

  async componentDidMount() {
    await this.carregarSessoes();
  }

  carregarSessoes = async () => {
    try {
      const token = await AsyncStorage.getItem('@jwt_token');
      // Bate na rota de sessões do seu NestJS
      const response = await api.get('/session', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      this.setState({ sessoes: response.data, loadingDados: false });
    } catch (error) {
      console.log('Erro ao buscar sessões:', error);
      Alert.alert('Erro', 'Não foi possível carregar as sessões.');
      this.setState({ loadingDados: false });
    }
  }

  handleCompra = async () => {
    const { sessaoSelecionada, sessoes } = this.state;

    if (!sessaoSelecionada) {
      Alert.alert('Atenção', 'Por favor, selecione uma sessão na lista acima!');
      return;
    }

    this.setState({ loadingCompra: true });

    try {
      // 1. Encontra os detalhes visuais da sessão que o usuário clicou para mostrar no carrinho
      const sessaoCompleta = sessoes.find(s => s.id === sessaoSelecionada);
      
      const fileira = ['A', 'B', 'C', 'D', 'E'][Math.floor(Math.random() * 5)];
      const numero = Math.floor(Math.random() * 20) + 1;
      const cadeira = `${fileira}${numero}`;
      const precoFixo = 25.00;

      // 2. Monta o objeto do Item do Carrinho
      const novoItemCarrinho = {
        idTemp: Math.random().toString(36).substring(7), // ID temporário pro React listar
        tipo: 'ingresso',
        sessionId: sessaoSelecionada,
        seat: cadeira,
        price: precoFixo,
        tituloVisual: `🎬 ${sessaoCompleta?.movie?.title || 'Filme'}`,
        detalheVisual: `Sala: ${sessaoCompleta?.room?.name || '?'} | Cadeira: ${cadeira}`,
      };

      // 3. Puxa o carrinho atual da memória (se existir)
      const carrinhoSalvo = await AsyncStorage.getItem('@carrinho');
      let carrinho = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];

      // 4. Adiciona o novo ingresso e salva de volta
      carrinho.push(novoItemCarrinho);
      await AsyncStorage.setItem('@carrinho', JSON.stringify(carrinho));

      this.setState({ loadingCompra: false });
      Alert.alert('Adicionado!', 'Ingresso colocado no carrinho com sucesso!');
      
      // Volta para o Menu
      this.props.navigation.goBack();

    } catch (error) {
      console.log('Erro ao salvar no carrinho:', error);
      Alert.alert('Erro', 'Não foi possível adicionar ao carrinho.');
      this.setState({ loadingCompra: false });
    }
  }

  // Função para formatar a data que vem do Prisma de um jeito bonito
  formatarData = (dataString: string) => {
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', { 
      day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' 
    });
  }

  render() {
    const { sessoes, sessaoSelecionada, loadingDados, loadingCompra } = this.state;

    return (
      <View style={styles.container}>
        <Header title="Comprar Ingresso" />

        <ScrollView contentContainerStyle={styles.body}>
          <TouchableOpacity 
            style={styles.backBtn} 
            onPress={() => this.props.navigation.goBack()}
          >
            <Text style={styles.backBtnText}>⬅ Voltar para o Menu</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Escolha a Sessão:</Text>

          {loadingDados ? (
            <ActivityIndicator size="large" color="#BFA8D1" style={{ marginVertical: 20 }} />
          ) : sessoes.length === 0 ? (
            <Text style={styles.emptyText}>Nenhuma sessão disponível hoje.</Text>
          ) : (
            // Desenha a lista de sessões vindas do backend
            sessoes.map((sessao) => (
              <TouchableOpacity 
                key={sessao.id}
                style={[
                  styles.sessionCard, 
                  sessaoSelecionada === sessao.id && styles.sessionCardActive
                ]}
                onPress={() => this.setState({ sessaoSelecionada: sessao.id })}
              >
                <Text style={styles.movieName}>{sessao.movie?.title || 'Filme Desconhecido'}</Text>
                <Text style={styles.sessionDetails}>
                  🕒 {this.formatarData(sessao.startTime)}
                </Text>
                <Text style={styles.sessionDetails}>
                  🚪 Sala: {sessao.room?.name || 'Não informada'}
                </Text>
              </TouchableOpacity>
            ))
          )}

          <TouchableOpacity 
            style={[
              styles.buyBtn, 
              (loadingCompra || !sessaoSelecionada) && { opacity: 0.5 }
            ]} 
            onPress={this.handleCompra}
            disabled={loadingCompra || !sessaoSelecionada}
          >
            <Text style={styles.buyBtnText}>
              {loadingCompra ? 'Processando...' : 'Confirmar Compra'}
            </Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1A24' },
  body: { padding: 20, flexGrow: 1 },
  backBtn: {
    backgroundColor: '#30293B', padding: 12, borderRadius: 8, alignItems: 'center',
    marginBottom: 20, borderWidth: 1, borderColor: '#4A3E5C',
  },
  backBtnText: { color: '#D1C4E9', fontSize: 16, fontWeight: 'bold' },
  label: { color: '#E5DDF0', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  emptyText: { color: '#A395B8', textAlign: 'center', fontStyle: 'italic', marginBottom: 20 },
  
  sessionCard: {
    backgroundColor: '#30293B',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4A3E5C',
    marginBottom: 10,
  },
  sessionCardActive: {
    borderColor: '#4CAF50', // Fica verde quando selecionado
    backgroundColor: '#38423b',
  },
  movieName: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  sessionDetails: { color: '#BFA8D1', fontSize: 14, marginTop: 2 },
  
  buyBtn: { backgroundColor: '#4CAF50', padding: 18, borderRadius: 10, alignItems: 'center', marginTop: 20, elevation: 3 },
  buyBtnText: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
});