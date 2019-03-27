import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-elements';
import { withNavigation } from 'react-navigation';

class SettingsButton extends React.Component {
  render() {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('Settings')}>
        <Icon
          name='md-settings'
          type='ionicon'
          size={30}
          iconStyle={{marginRight: 10}}
        />
      </TouchableOpacity>
    );
  }
}

export default withNavigation(SettingsButton);