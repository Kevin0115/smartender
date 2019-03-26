import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  AsyncStorage
} from 'react-native';
import { StyledButton, StyledText, StyledScreen } from '../components/StyledElements';
import { APP_ID, BASE_URL } from '../constants/Auth';
import Colors from '../constants/Colors';

export default class SettingsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '',
      userPic: 'undefined',
      isGuest: true,
      drinkCount: "  "
    }
  }

  componentDidMount() {
    this._retrieveData();
  }

  _retrieveData = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem('fbUser'));
    const userPic = JSON.parse(await AsyncStorage.getItem('picUrl'));
    const isGuest = JSON.parse(await AsyncStorage.getItem('isGuest'));

    fetch(BASE_URL + '/users/' + userData.id, {
      method: 'GET',
    })
    .then(res => res.json())
    .then(json => this.setState({drinkCount: json.drink_count}))
    .catch(function(error) {
      console.log('Error: ' + error.message);
      throw error;
    });

    this.setState({
      userName: userData.name,
      userPic: userPic,
      isGuest: isGuest,
    });
  }

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
      <StyledScreen>
        <View style={styles.profilePicContainer}>
          <Image
            style={styles.profilePic}
            source={
              this.state.isGuest ? 
              require('../assets/images/guest.png')
              :
              {uri: this.state.userPic}
            }
          />
        </View>
        <View style={styles.nameContainer}>
          <StyledText style={styles.name}>
            {this.state.userName}
          </StyledText>
        </View>
        {
          this.state.isGuest ?
          <View style={{flex: 1}} />
          :
          <StyledText style={{flex: 1, fontSize: 20}}>
            Drinks Ordered: {this.state.drinkCount}
          </StyledText>}
        <View style={{flex: 2}} />
        <View style={styles.buttonContainer}>
          <StyledButton
            buttonStyle={styles.logoutButton}
            titleStyle={styles.buttonTitle}
            title='Logout'
            onPress={this._handleLogout}
          />
        </View>
        <View style={styles.buttonContainer}>
          <StyledButton
            buttonStyle={styles.cancelButton}
            title='Cancel'
            onPress={() => this.props.navigation.popToTop()}
          />
        </View>
      </StyledScreen>
    );
  }
}

const styles = StyleSheet.create({
  profilePicContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePic: {
    borderWidth: 2,
    borderColor: Colors.black,
    width: 160,
    height: 160,
    borderRadius: 8,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 28, 
  },
  buttonContainer: {
    flex: 0.8,
  },
  logoutButton: {
    width: 254,
    height: 56,
    backgroundColor: '#ce4848',
  },
  cancelButton: {
    width: 254,
    height: 56,
  },
  buttonTitle: {
    color: 'white',
  }
});