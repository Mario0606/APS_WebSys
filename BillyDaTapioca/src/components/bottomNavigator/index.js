import * as React from 'react';
import { BottomNavigation, Text } from 'react-native-paper';
import ListaTapiocas from '../listaItens/tapiocas'
import ListaBebidas from '../listaItens/bebidas'


export default class MyComponent extends React.Component {
  state = {
    index: 0,
    routes: [
      { key: 'tapiocas', title: 'Tapiocas', icon: 'blur-circular' },
      { key: 'bebidas', title: 'Bebidas', icon: 'local-cafe' },
    ],
  };

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    tapiocas: ListaTapiocas,
    bebidas: ListaBebidas,
  });

  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    );
  }
}