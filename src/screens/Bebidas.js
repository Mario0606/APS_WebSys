import React, { Component } from "react";
import { View, StyleSheet, FlatList } from "react-native";
import { List, Text, Button, Appbar } from "react-native-paper";
import api from "../services/api";
import TotalCompras from "../components/totalCompra";
import { moneyFormat } from "../services/utils";
import CarrinhoIndicator from "../components/carrinhoIndicator";

export class ListaBebidas extends Component {

  static navigationOptions = ({ navigation }) => {
    return {
      header: (
        <Appbar.Header>
          <Appbar.BackAction
            onPress={ () => {
              navigation.getParam('addCarrinho')(navigation.getParam('localCar')());
              navigation.pop()
            }}
          />
          <Appbar.Content
            title="Bebidas"
          />
        </Appbar.Header>
      )
    };
  };

  state = {
    bebidas: [],
    precoTotal: 0,
    userLevel: 0
  };

  componentDidMount() {
    this.getBebidas();
    this.props.navigation.setParams({localCar: this.returnBebidasList});
  }

  getBebidas = async () => {
    const r = await api.get("/bebidas");

    const items = r.data;
    const bebidas = items.map(item => {
      return { item, qtde: 0 };
    });

    await this.setState({ bebidas: bebidas });
  };

  renderItems = ({ item }) => (
    <View
      styles={{
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
      }}
    >
      <List.Item
        title={item.item.descricao}
        description={`R$ ${moneyFormat(item.item.valor)}`}
        titleEllipsizeMode="middle"
        left={props => (
          <Button
            onPress={() => console.log("Pressed")}
            icon="notifications"
            mode="outline"
            compact="true"
            disabled={item.item.disponibilidade}
          />
        )}
        right={props => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-around"
            }}
          >
            <Button
              onPress={async () => {
                let price = 0;
                const newbebidas = this.state.bebidas.map(tapioca => {
                  if (tapioca.item.id == item.item.id) {
                    if (tapioca.qtde > 0) {
                      tapioca.qtde = tapioca.qtde - 1;
                      price = price + tapioca.item.valor;
                    }
                  }
                  return tapioca;
                });
                await this.setState({
                  bebidas: newbebidas,
                  precoTotal: this.state.precoTotal - price
                });
              }}
              icon="expand-more"
              mode="outline"
              compact="true"
              disabled={!item.item.disponibilidade}
            />

            <Text style={{ marginTop: 10 }}>{item.qtde}</Text>

            <Button
              onPress={async () => {
                let price = 0;
                const newbebidas = this.state.bebidas.map(tapioca => {
                  if (tapioca.item.id == item.item.id) {
                    tapioca.qtde = tapioca.qtde + 1;
                    price = price + tapioca.item.valor;
                  }
                  return tapioca;
                });
                await this.setState({
                  bebidas: newbebidas,
                  precoTotal: this.state.precoTotal + price
                });
                console.log(this.state.precoTotal);
              }}
              icon="expand-less"
              mode="outline"
              compact="true"
              disabled={!item.item.disponibilidade}
            />
          </View>
        )}
      />
    </View>
  );

  lenCarrinhoGlobal = () => {
    let carrinho = this.props.navigation.getParam('getCarrinho')();

    let list = this.returnBebidasList();
    
    return carrinho.length+list.length;
  }

  returnBebidasList = () => {
    let list = this.state.bebidas.filter((bebida) => {
      return bebida.qtde > 0
    })

    return list;
  }

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.state.bebidas}
          keyExtractor={tapioca => tapioca.item.id.toString()}
          renderItem={this.renderItems}
        />

        <View
          style={{
            alignSelf: "flex-end"
          }}
        >
          <TotalCompras repassePreco={this.state.precoTotal} />
        </View>
        {this.lenCarrinhoGlobal() ? <CarrinhoIndicator /> : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default ListaBebidas;
