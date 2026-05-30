import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, FlatList, ActivityIndicator } from 'react-native';
import Header from '../components/header';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface SnacksScreenProps {
  navigation?: any;
}

interface SnacksState {
  combos: any[];
  comboSelecionado: any | null;
  quantidade: number;
  loadingDados: boolean;
  loadingAdd: boolean;
}

export default class SnacksScreen extends Component<SnacksScreenProps, SnacksState> {
  constructor(props: SnacksScreenProps) {
    super(props);
    this.state = {
      combos: [],
      comboSelecionado: null,
      quantidade: 1, // Começa sempre com 1
      loadingDados: true,
      loadingAdd: false,
    };
  }

  async componentDidMount() {
    await this.carregarCombos();
  }

  carregarCombos = async () => {
    try {
      const token = await AsyncStorage.getItem('@jwt_token');
      // Tenta buscar na rota (pode ser /snack-combos, /snacks ou /combos dependendo do seu NestJS)
      const response = await api.get('/snack-combo', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      this.setState({ combos: response.data, loadingDados: false });
    } catch (error) {
      console.log('Erro ao buscar lanches:', error);
      this.setState({ loadingDados: false });
    }
  }

  alterarQuantidade = (valor: number) => {
    const novaQuantidade = this.state.quantidade + valor;
    if (novaQuantidade >= 1 && novaQuantidade <= 10) {
      this.setState({ quantidade: novaQuantidade });
    }
  }

  handleAddCarrinho = async () => {
    const { comboSelecionado, quantidade } = this.state;

    if (!comboSelecionado) {
      Alert.alert('Atenção', 'Selecione um combo primeiro!');
      return;
    }

    this.setState({ loadingAdd: true });

    try {
      // 1. Calcula o preço total deste item (Preço do Combo x Quantidade)
      const precoTotal = comboSelecionado.price * quantidade;

      // 2. Monta o objeto do Item do Carrinho no mesmo padrão dos Ingressos
      const novoItemCarrinho = {
        idTemp: Math.random().toString(36).substring(7),
        tipo: 'lanche', // Identificador essencial para o backend depois
        snackComboId: comboSelecionado.id,
        quantity: quantidade,
        price: precoTotal, 
        tituloVisual: `🍿 ${comboSelecionado.name}`,
        detalheVisual: `Quantidade: ${quantidade}x | Valor Unitário: R$ ${comboSelecionado.price.toFixed(2)}`,
      };

      // 3. Puxa o carrinho e adiciona
      const carrinhoSalvo = await AsyncStorage.getItem('@carrinho');
      let carrinho = carrinhoSalvo ? JSON.parse(carrinhoSalvo) : [];

      carrinho.push(novoItemCarrinho);
      await AsyncStorage.setItem('@carrinho', JSON.stringify(carrinho));

      this.setState({ loadingAdd: false, quantidade: 1, comboSelecionado: null });
      Alert.alert('Humm... Delícia!', 'Combo adicionado ao carrinho com sucesso!');
      
      this.props.navigation.goBack();

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível adicionar ao carrinho.');
      this.setState({ loadingAdd: false });
    }
  }

  renderCombo = ({ item }: { item: any }) => {
    const isSelecionado = this.state.comboSelecionado?.id === item.id;
    
    return (
      <TouchableOpacity 
        style={[styles.snackCard, isSelecionado && styles.snackCardActive]}
        onPress={() => this.setState({ comboSelecionado: item })}
      >
        <Text style={styles.snackName}>{item.name}</Text>
        <Text style={styles.snackPrice}>R$ {item.price.toFixed(2)}</Text>
      </TouchableOpacity>
    );
  }

  render() {
    const { combos, comboSelecionado, quantidade, loadingDados, loadingAdd } = this.state;

    return (
      <View style={styles.container}>
        <Header title="Bomboniere" />

        <View style={styles.body}>
          <TouchableOpacity style={styles.backBtn} onPress={() => this.props.navigation.goBack()}>
            <Text style={styles.backBtnText}>⬅ Voltar para o Menu</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Nossos Combos:</Text>

          {loadingDados ? (
            <ActivityIndicator size="large" color="#BFA8D1" style={{ marginVertical: 20 }} />
          ) : combos.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum lanche cadastrado no momento. (Crie no Prisma Studio!)</Text>
          ) : (
            <FlatList
              data={combos}
              keyExtractor={(item) => item.id}
              renderItem={this.renderCombo}
              contentContainerStyle={{ paddingBottom: 20 }}
            />
          )}

          {/* Só mostra os controles de quantidade se um combo for selecionado */}
          {comboSelecionado && (
            <View style={styles.actionContainer}>
              <Text style={styles.selectionLabel}>Quantidade:</Text>
              
              <View style={styles.qtyRow}>
                <TouchableOpacity style={styles.qtyBtn} onPress={() => this.alterarQuantidade(-1)}>
                  <Text style={styles.qtyBtnText}>-</Text>
                </TouchableOpacity>
                
                <Text style={styles.qtyNumber}>{quantidade}</Text>
                
                <TouchableOpacity style={styles.qtyBtn} onPress={() => this.alterarQuantidade(1)}>
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity 
                style={[styles.addBtn, loadingAdd && { opacity: 0.5 }]} 
                onPress={this.handleAddCarrinho}
                disabled={loadingAdd}
              >
                <Text style={styles.addBtnText}>
                  {loadingAdd ? 'Adicionando...' : `Adicionar (R$ ${(comboSelecionado.price * quantidade).toFixed(2)})`}
                </Text>
              </TouchableOpacity>
            </View>
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
  label: { color: '#E5DDF0', fontSize: 18, fontWeight: 'bold', marginBottom: 15 },
  emptyText: { color: '#A395B8', textAlign: 'center', fontStyle: 'italic', marginBottom: 20 },
  
  snackCard: { backgroundColor: '#30293B', padding: 20, borderRadius: 10, borderWidth: 2, borderColor: '#4A3E5C', marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  snackCardActive: { borderColor: '#E5A93C', backgroundColor: '#423625' }, // Amarelo/Dourado para a comida
  snackName: { color: '#FFF', fontSize: 18, fontWeight: 'bold' },
  snackPrice: { color: '#4CAF50', fontSize: 18, fontWeight: 'bold' },
  
  actionContainer: { backgroundColor: '#30293B', padding: 15, borderRadius: 10, marginTop: 10, borderWidth: 1, borderColor: '#4A3E5C' },
  selectionLabel: { color: '#E5DDF0', textAlign: 'center', marginBottom: 10, fontSize: 16 },
  qtyRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  qtyBtn: { backgroundColor: '#6C5B7B', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  qtyBtnText: { color: '#FFF', fontSize: 24, fontWeight: 'bold', lineHeight: 28 },
  qtyNumber: { color: '#FFF', fontSize: 22, fontWeight: 'bold', marginHorizontal: 20 },
  
  addBtn: { backgroundColor: '#E5A93C', padding: 15, borderRadius: 10, alignItems: 'center' },
  addBtnText: { color: '#1E1A24', fontSize: 16, fontWeight: 'bold' },
});