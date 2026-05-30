import React, { Component } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/header';
import api from '../services/api';

interface CartScreenProps {
  navigation?: any;
}

interface CartState {
  itens: any[];
  total: number;
  loadingCompra: boolean; // Controla o botão de pagamento
}

export default class CartScreen extends Component<CartScreenProps, CartState> {
  constructor(props: CartScreenProps) {
    super(props);
    this.state = {
      itens: [],
      total: 0,
      loadingCompra: false,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener('focus', () => {
      this.carregarCarrinho();
    });
  }

  carregarCarrinho = async () => {
    try {
      const carrinhoSalvo = await AsyncStorage.getItem('@carrinho');
      if (carrinhoSalvo) {
        const itens = JSON.parse(carrinhoSalvo);
        const total = itens.reduce((soma: number, item: any) => soma + Number(item.price), 0);
        this.setState({ itens, total });
      } else {
        this.setState({ itens: [], total: 0 });
      }
    } catch (error) {
      console.log('Erro ao ler carrinho:', error);
    }
  }

  limparCarrinho = async () => {
    await AsyncStorage.removeItem('@carrinho');
    this.setState({ itens: [], total: 0 });
  }

  finalizarPedido = async () => {
    const { itens } = this.state;

    if (itens.length === 0) {
      Alert.alert('Atenção', 'Seu carrinho está vazio!');
      return;
    }

    this.setState({ loadingCompra: true });

    try {
      const token = await AsyncStorage.getItem('@jwt_token');
      // Tenta pegar o ID do usuário logado (explicado logo abaixo!)
      const userId = await AsyncStorage.getItem('@user_id'); 

      // 1. Separa o que é ingresso e o que é lanche
      const ingressosTemporarios = itens.filter(item => item.tipo === 'ingresso');
      const lanchesTemporarios = itens.filter(item => item.tipo === 'lanche');

      // 2. Cria os ingressos reais no banco para pegar os IDs gerados
      const ticketIdsRealizados: string[] = [];
      
      for (const ingresso of ingressosTemporarios) {
        const resTicket = await api.post('/ticket', {
          sessionId: ingresso.sessionId,
          seat: ingresso.seat,
          price: ingresso.price
        }, { headers: { Authorization: `Bearer ${token}` } });
        
        ticketIdsRealizados.push(resTicket.data.id);
      }

    const mapaLanches = new Map();
      
      lanchesTemporarios.forEach(lanche => {
        // Se o lanche já existe no mapa, apenas soma a quantidade nova com a que já estava lá
        if (mapaLanches.has(lanche.snackComboId)) {
          const quantidadeAtual = mapaLanches.get(lanche.snackComboId);
          mapaLanches.set(lanche.snackComboId, quantidadeAtual + lanche.quantity);
        } else {
          // Se não existe ainda, adiciona pela primeira vez
          mapaLanches.set(lanche.snackComboId, lanche.quantity);
        }
      });

      // Transforma o Mapa de volta em um Array do jeito que o NestJS exige
      const snackCombosFormatados = Array.from(mapaLanches, ([snackComboId, quantity]) => ({
        snackComboId,
        quantity
      }));

      // 4. Monta o pacote final do Pedido
      const payloadOrder = {
        userId: userId,
        ticketIds: ticketIdsRealizados,
        snackCombos: snackCombosFormatados
      };

      // 5. Envia o pedido definitivo
      await api.post('/order', payloadOrder, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 6. Limpa o carrinho e comemora
      await AsyncStorage.removeItem('@carrinho');
      this.setState({ itens: [], total: 0, loadingCompra: false });

      Alert.alert('Sucesso! 🎉', 'Pagamento aprovado e pedido realizado!');
      
      // Redireciona o usuário para a tela de Meus Pedidos
      this.props.navigation.navigate('MyOrders');

    } catch (error: any) {
      console.log('Erro ao finalizar pedido:', error.response?.data || error.message);
      Alert.alert('Erro 400', 'O backend recusou. Olhe o terminal do VS Code!');
      this.setState({ loadingCompra: false });
    }
  }

  renderItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <View style={styles.itemInfo}>
        <Text style={styles.itemTitle}>{item.tituloVisual}</Text>
        <Text style={styles.itemSub}>{item.detalheVisual}</Text>
      </View>
      <Text style={styles.itemPrice}>R$ {Number(item.price).toFixed(2)}</Text>
    </View>
  );

  render() {
    const { itens, total, loadingCompra } = this.state;

    return (
      <View style={styles.container}>
        <Header title="Meu Carrinho" />

        <View style={styles.body}>
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()} style={styles.backBtn}>
              <Text style={styles.backBtnText}>⬅ Voltar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={this.limparCarrinho} style={styles.clearBtn} disabled={loadingCompra}>
              <Text style={styles.clearBtnText}>🗑️ Esvaziar</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={itens}
            keyExtractor={(item) => item.idTemp}
            renderItem={this.renderItem}
            ListEmptyComponent={<Text style={styles.emptyText}>O carrinho está vazio.</Text>}
            contentContainerStyle={{ paddingBottom: 20 }}
          />

          <View style={styles.footer}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total do Pedido:</Text>
              <Text style={styles.totalValue}>R$ {total.toFixed(2)}</Text>
            </View>

            <TouchableOpacity 
              style={[styles.checkoutBtn, (loadingCompra || itens.length === 0) && { opacity: 0.5 }]} 
              onPress={this.finalizarPedido}
              disabled={loadingCompra || itens.length === 0}
            >
              <Text style={styles.checkoutBtnText}>
                {loadingCompra ? 'Processando Pagamento...' : 'Avançar para Pagamento'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1A24' },
  body: { flex: 1, padding: 20 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  backBtn: { backgroundColor: '#30293B', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#4A3E5C' },
  backBtnText: { color: '#D1C4E9', fontWeight: 'bold' },
  clearBtn: { padding: 10 },
  clearBtnText: { color: '#FF6B6B', fontWeight: 'bold' },
  emptyText: { color: '#A395B8', textAlign: 'center', marginTop: 50, fontSize: 16, fontStyle: 'italic' },
  cartItem: { backgroundColor: '#30293B', padding: 15, borderRadius: 10, marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderWidth: 1, borderColor: '#4A3E5C' },
  itemInfo: { flex: 1 },
  itemTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginBottom: 4 },
  itemSub: { color: '#BFA8D1', fontSize: 12 },
  itemPrice: { color: '#4CAF50', fontSize: 16, fontWeight: 'bold', marginLeft: 10 },
  footer: { backgroundColor: '#30293B', padding: 20, borderRadius: 15, marginTop: 10, borderWidth: 1, borderColor: '#6C5B7B' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { color: '#E5DDF0', fontSize: 18, fontWeight: 'bold' },
  totalValue: { color: '#4CAF50', fontSize: 22, fontWeight: '900' },
  checkoutBtn: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center' },
  checkoutBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});