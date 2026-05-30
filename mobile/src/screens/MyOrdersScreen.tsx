import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, ActivityIndicator } from 'react-native';
import Header from '../components/header';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface MyOrdersScreenProps {
  navigation?: any;
}

interface MyOrdersState {
  pedidos: any[];
  loading: boolean;
}

export default class MyOrdersScreen extends Component<MyOrdersScreenProps, MyOrdersState> {
  constructor(props: MyOrdersScreenProps) {
    super(props);
    this.state = {
      pedidos: [],
      loading: true,
    };
  }

  async componentDidMount() {
    await this.carregarPedidos();
  }

 carregarPedidos = async () => {
    try {
      const token = await AsyncStorage.getItem('@jwt_token');
      const userId = await AsyncStorage.getItem('@user_id'); // Pega o ID logado
      
      if (!userId) {
        Alert.alert('Erro', 'Usuário não identificado. Faça login novamente.');
        this.setState({ loading: false });
        return;
      }

      // Agora o app bate na rota nova passando o ID na URL!
      // (Se o seu controller for plural no backend, mude 'order' para 'orders')
      const response = await api.get(`/order/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      this.setState({ pedidos: response.data, loading: false });
    } catch (error) {
      console.log('Erro ao buscar pedidos:', error);
      Alert.alert('Erro', 'Não foi possível carregar o histórico de pedidos.');
      this.setState({ loading: false });
    }
  }

  // Função para formatar a data do pedido
  formatarData = (dataString: string) => {
    if (!dataString) return '';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  renderPedido = ({ item }: { item: any }) => {
    // Pega os 6 últimos caracteres do ID para ser o "Número do Pedido"
    const numeroPedido = item.id.substring(item.id.length - 6).toUpperCase();

    return (
      <View style={styles.orderCard}>
        {/* Cabeçalho do Pedido */}
        <View style={styles.orderHeader}>
          <Text style={styles.orderId}>Pedido #{numeroPedido}</Text>
          <Text style={styles.orderDate}>{this.formatarData(item.createdAt)}</Text>
        </View>

        <View style={styles.orderBody}>
          {/* Seção de Ingressos */}
          {item.tickets && item.tickets.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🎫 Ingressos ({item.tickets.length}):</Text>
              {item.tickets.map((ticket: any, index: number) => {
                // Tenta pegar o nome do filme se o backend enviar, senão mostra a cadeira
                const titulo = ticket.session?.movie?.title || 'Sessão de Cinema';
                return (
                  <Text key={index} style={styles.itemText}>
                    • {titulo} (Cadeira: {ticket.seat})
                  </Text>
                );
              })}
            </View>
          )}

          {/* Linha divisória se tiver ingressos e lanches */}
          {item.tickets?.length > 0 && item.snackCombos?.length > 0 && (
            <View style={styles.divider} />
          )}

          {/* Seção de Lanches (Bomboniere) */}
          {item.snackCombos && item.snackCombos.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>🍿 Bomboniere:</Text>
              {item.snackCombos.map((comboOnOrder: any, index: number) => {
                const nomeSnack = comboOnOrder.snackCombo?.name || 'Combo de Lanche';
                return (
                  <Text key={index} style={styles.itemText}>
                    • {comboOnOrder.quantity}x {nomeSnack}
                  </Text>
                );
              })}
            </View>
          )}
        </View>

        {/* Rodapé com o Total */}
        <View style={styles.orderFooter}>
          <Text style={styles.totalText}>Valor Pago: R$ {Number(item.total).toFixed(2)}</Text>
        </View>
      </View>
    );
  }

  render() {
    const { pedidos, loading } = this.state;

    return (
      <View style={styles.container}>
        <Header title="Meus Pedidos" />

        <View style={styles.body}>
          <TouchableOpacity style={styles.backBtn} onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.backBtnText}>⬅ Voltar para o Menu</Text>
          </TouchableOpacity>

          {loading ? (
            <ActivityIndicator size="large" color="#BFA8D1" style={{ marginTop: 40 }} />
          ) : (
            <FlatList
              data={pedidos}
              keyExtractor={(item) => item.id}
              renderItem={this.renderPedido}
              contentContainerStyle={{ paddingBottom: 20 }}
              ListEmptyComponent={
                <Text style={styles.emptyText}>Você ainda não possui nenhum pedido concluído.</Text>
              }
            />
          )}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1A24' },
  body: { padding: 20, flex: 1 },
  backBtn: { backgroundColor: '#30293B', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#4A3E5C' },
  backBtnText: { color: '#D1C4E9', fontSize: 16, fontWeight: 'bold' },
  emptyText: { color: '#A395B8', textAlign: 'center', fontStyle: 'italic', marginTop: 30, fontSize: 16 },
  
  orderCard: { backgroundColor: '#30293B', borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: '#4A3E5C', overflow: 'hidden', elevation: 3 },
  orderHeader: { backgroundColor: '#6C5B7B', padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderId: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  orderDate: { color: '#D1C4E9', fontSize: 14 },
  
  orderBody: { padding: 15 },
  section: { marginBottom: 10 },
  sectionTitle: { color: '#E5DDF0', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  itemText: { color: '#BFA8D1', fontSize: 15, marginLeft: 10, marginBottom: 3 },
  divider: { height: 1, backgroundColor: '#4A3E5C', marginVertical: 10 },
  
  orderFooter: { backgroundColor: '#1E1A24', padding: 15, borderTopWidth: 1, borderTopColor: '#4A3E5C', alignItems: 'flex-end' },
  totalText: { color: '#4CAF50', fontSize: 18, fontWeight: 'bold' },
});