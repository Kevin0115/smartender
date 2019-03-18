import React from 'react';
import { createSwitchNavigator,createAppContainer } from 'react-navigation';

import MainStackNavigator from './MainStackNavigator';
import LoginScreen from '../screens/LoginScreen';
import AuthScreen from '../screens/AuthScreen';

export default createAppContainer(createSwitchNavigator(
    {
      Login: LoginScreen,
      Auth: AuthScreen,
      Main: MainStackNavigator,
    },
    {
      initialRouteName: 'Auth',
    }
  )
);