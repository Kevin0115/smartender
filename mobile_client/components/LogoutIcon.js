import React from 'react';
import { AsyncStorage, Alert, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

class LogoutIcon extends React.Component {

  _logOut = async () => {
    await AsyncStorage.removeItem('fbUser');
    this.props.navigation.navigate('Auth');
  }
  
  _handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'OK', onPress: () => this._logOut()},
      ],
      {cancelable: true},
    );
  };

  render() {
    return (
      <TouchableOpacity
        onPress={this._handleLogout}
      >
        <Icon
          name='md-log-out'
          type='ionicon'
          size={30}
          iconStyle={{marginRight: 10}}
        />
      </TouchableOpacity>
    );
  }
}

export default withNavigation(LogoutIcon);