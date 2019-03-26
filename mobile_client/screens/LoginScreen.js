import React from "react";
import {
  AsyncStorage,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Font } from 'expo';
import { Button, Icon } from "react-native-elements";
import { APP_ID, BASE_URL } from '../constants/Auth';

export default class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalVisible: false,
      modalImage: require('../assets/images/error.png'),
      modalTitleText: 'We could not log you in',
      modalBodyText: 'Something went wrong.'
    }
  }

  static navigationOptions = {
    header: null,
  };

  async logIn() {
    const options = {
      permissions: ['public_profile'],
      behaviour: 'native',
    };
    try {
      const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync(APP_ID, options);
      if (type === 'success') {
        const loginBody = JSON.stringify({'fb_token': token.toString()});
        // Store the User's Name
        const userResponse = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name`);
        const userResponseJson = (await userResponse.json());
        await AsyncStorage.setItem('fbUser', JSON.stringify(userResponseJson));

        // Store the User's Photo URL
        const picResponse = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=picture.type(large)`);
        const picResponseJson = (await picResponse.json()).picture.data.url;
        await AsyncStorage.setItem('picUrl', JSON.stringify(picResponseJson));
        
        // Only for Guest Login Usage
        await AsyncStorage.setItem('isGuest', JSON.stringify(false));

        this._createUserDB({
          username: userResponseJson.name,
          id: userResponseJson.id,
          pic: picResponseJson
        });

        this.props.navigation.navigate('Main');
      }
    } catch (err) {
      console.log('Error: ', err);
    }
  }

  async guestLogin() {
    await AsyncStorage.setItem('fbUser', JSON.stringify({name: 'Guest'}));
    await AsyncStorage.setItem('picUrl', JSON.stringify('../assets/images/guest.png'));
    // Only for Guest Login Usage
    await AsyncStorage.setItem('isGuest', JSON.stringify(true));
    this.props.navigation.navigate('Main');
  }

  _createUserDB = async (userJson) => {
    console.log(userJson);
    const userInfo = JSON.stringify(userJson);
    fetch(BASE_URL + '/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: userInfo,
    })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(function(error) {
      console.log('Error: ' + error.message);
      throw error;
    });
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={{flex: 1}} />
        <View style={styles.logoContainer}>
            <Image
              source={require('../assets/images/logotext.png')}
              style={styles.logoPlaceholder}
            />
        </View>
        <View style={styles.buttonSection}>
          <View style={styles.buttonContainer}>
            <Button
              title="Login with Facebook"
              onPress={() => this.logIn()}
              buttonStyle={styles.fbLogin}
              titleStyle={styles.buttonTitle}
              raised={true}
              icon={
                <Icon
                  name='logo-facebook'
                  type='ionicon'
                  size={50}
                  color='white'
                />
              }
            />
          </View>
          <View style={styles.buttonContainer}>
            <Button
              title="Continue as Guest"
              onPress={() => this.guestLogin()}
              buttonStyle={styles.guestLogin}
              titleStyle={styles.buttonTitle}
              raised={true}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
  },
  logoContainer: {
    flex: 4.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholder: {
    width: 204,
    height: 178,
  },
  buttonSection: {
    flex: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    marginBottom: 10,
  },
  fbLogin: {
    backgroundColor: '#3b4998',
    width: 254,
    height: 56,
    paddingTop: 2,
    borderRadius: 6,
  },
  guestLogin: {
    backgroundColor: '#c2c2c2',
    width: 254,
    height: 56,
    borderRadius: 6,
  },
  buttonTitle: {
    fontFamily: 'cabin',
    fontSize: 16,
    marginLeft: 16,
  },
});