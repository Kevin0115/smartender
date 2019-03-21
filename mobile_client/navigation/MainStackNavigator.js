import React from 'react';
import { Platform, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import { Icon } from 'expo';

import Colors from '../constants/Colors';
import HomeScreen from '../screens/HomeScreen';
import DrinkScreen from '../screens/DrinkScreen';
import ScanScreen from '../screens/ScanScreen';
import OrderScreen from '../screens/OrderScreen';
import SettingsScreen from '../screens/SettingsScreen';
import SettingsIcon from '../components/SettingsIcon';
import LogoutIcon from '../components/LogoutIcon';

class LogoIcon extends React.Component {
  render() {
    return (
      <Image
        source={require('../assets/images/logo.png')}
        style={{ height: 18, width: 160 }}
      />
    );
  }
}

const HomeStack = createStackNavigator(
  {
    Home: {
      screen: HomeScreen,
    },
    Settings: {
      screen: SettingsScreen,
      navigationOptions: ({ navigation }) => ({
        headerRight: <LogoutIcon />,
      }),
    }
  },
  {
    headerMode: 'none',
    mode: 'modal',
  }
);

export default createStackNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: ({ navigation }) => ({
        headerTitle: <LogoIcon />,
        headerRight: <SettingsIcon />,
      }),
    },
    Drink: {
      screen: DrinkScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Drink Info',
      }),
    },
    Scan: {
      screen: ScanScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'Find a Smartender',
      }),
    },
    Order: {
      screen: OrderScreen,
      navigationOptions: ({ navigation }) => ({
        headerTitle: 'All Done!',
        headerLeft: null,
        gesturesEnabled: false,
      }),
    }
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: () => ({
      ...headerStyle,
    }),
  },
);

const headerStyle = {
  headerStyle: {
    height: 50,
  },
  headerTitleStyle: {
    fontSize: 20,
    fontFamily: 'cabin-bold',
  },
  headerBackTitle: null,
};