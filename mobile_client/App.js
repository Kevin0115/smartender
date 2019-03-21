import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { createAppContainer } from 'react-navigation';

import AppNavigator from './navigation/AppNavigator';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
    }
  }

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <AppNavigator />
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        // Prefetch images here
        require('./assets/images/logotext.png'),
        require('./assets/images/logo.png'),
        require('./assets/images/ginandtonic.png'),
        require('./assets/images/rumandcoke.png'),
        require('./assets/images/cosmopolitan.png'),
        require('./assets/images/aviation.png'),
        require('./assets/images/vodkacranberry.png'),
        require('./assets/images/moscowmule.png'),
        require('./assets/images/whiterussian.png'),
        require('./assets/images/mojito.png'),
        require('./assets/images/drymartini.png'),
        require('./assets/images/oldfashioned.png'),
        require('./assets/images/success.png'),
        require('./assets/images/error.png')
      ]),
      Font.loadAsync({
        // ...Icon.Ionicons.font,
        'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
        'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
        'cabin-bold': require('./assets/fonts/Cabin-Bold.ttf'),
        'cabin': require('./assets/fonts/Cabin-Regular.ttf'),
        'cabin-medium': require('./assets/fonts/Cabin-Medium.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
