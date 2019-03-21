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
  }

  state = {
    isModalVisible: false,
    modalImage: require('../assets/images/error.png'),
    modalTitleText: 'We could not log you in',
    modalBodyText: 'Something went wrong.'
  };

  static navigationOptions = {
    header: null,
  };

  // _createUserDB = async (userJson) => {
  //   const userInfo = JSON.stringify(userJson);
  //   fetch(BASE_URL + '/users/create', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     body: userInfo,
  //   }).then((res) => res.json())
  //   .then((response) => {
  //     if (response.error) {
  //       console.warn("Error!", response.error);
  //     }
  //     console.log(response);
  //   })
  //   .catch((error) => {
  //     console.warn('Error: ', error);
  //   });
  // }

  async logIn() {
    const options = {
      permissions: ['public_profile'],
      behaviour: 'native',
    };
    try {
      const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync(APP_ID, options);
      if (type === 'success') {
        const loginBody = JSON.stringify({'fb_token': token.toString()});
        const userResponse = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name`);
        const userResponseJson = (await userResponse.json());
        await AsyncStorage.setItem('fbUser', JSON.stringify(userResponseJson));
        
        // this._createUserDB({
        //   ...userResponseJson,
        //   groups: []
        // });

        const picResponse = await fetch(`https://graph.facebook.com/me?access_token=${token}&fields=picture.type(large)`);
        const picResponseJson = (await picResponse.json()).picture.data.url;
        await AsyncStorage.setItem('picUrl', JSON.stringify(picResponseJson));

        this.props.navigation.navigate('Main');
      }
    } catch (err) {
      console.log('Error: ', err);
    }
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
        <View style={styles.buttonContainer}>
          <Button
            title="Login with Facebook"
            onPress={() => this.logIn()}
            buttonStyle={styles.button}
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
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholder: {
    // opacity: 0.6,
    width: 204,
    height: 178,
  },
  buttonContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#3b4998',
    width: 254,
    height: 56,
    paddingTop: 2,
    borderRadius: 6,
  },
  buttonTitle: {
    fontFamily: 'cabin',
    fontSize: 16,
    marginLeft: 16,
  },
});