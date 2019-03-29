import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import { LOCALHOST, BASE_URL } from '../constants/Auth';
import { StyledButton, StyledText, StyledScreen } from '../components/StyledElements';


export default class OrderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {    
      orderInfo: this.props.navigation.getParam('orderInfo'),

      // API Flags
      response: false, // To know when to display message, based on timer
      inventoryStatus: true,
      balanceStatus: true,
      available: true,
    }
    this._renderIndicator = this._renderIndicator.bind(this);
    this._renderMessage = this._renderMessage.bind(this);
    this._updateDrinkCount = this._updateDrinkCount.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({response: true});
    }, 2000)
    fetch(BASE_URL + '/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.props.navigation.getParam('orderInfo'))
    })
    .then(res => res.json())
    .then(json => {
      this.setState({
        inventoryStatus: json.status !== 'No Inventory',
        available: json.busy === false,
        balanceStatus: json.status !== 'Insufficient Funds',
      });
      console.log(json);
    })
    .then(setTimeout(() => {
      this._updateDrinkCount();
    }, 2000))
    // For drink counting purposes
    .catch(function(error) {
      console.log('Error: ' + error.message);
      throw error;
    });
  }

  async _updateDrinkCount() {
    const userData = JSON.parse(await AsyncStorage.getItem('fbUser'));

    fetch(BASE_URL + '/users/' + userData.id + '/drinks', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      // This might change if we allow multiple drink orders at once
      body: JSON.stringify({drinks: 1}),
    })
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(function(error) {
      console.log('Error: ' + error.message);
      throw error;
    });
  }

  _renderIndicator() {
    return (
      this.state.response ?
      this._renderMessage()
      :
      <View>
        <StyledText style={styles.confirm}>
          Please wait while your order is processed.
        </StyledText>
        <ActivityIndicator size='large' color='#0000ff' />
      </View>
    );
  }

  // Fix this for individual messages
  _renderMessage() {    
    return (
      this.state.inventoryStatus ?
      <View style={styles.container}>
        <Image
          source={require('../assets/images/success.png')}
          style={styles.check}              
        />
        <StyledText style={styles.confirm}>
          Thank you!{'\n'}Please see the smartender for instructions.
        </StyledText>
        <StyledButton
          buttonStyle={styles.button}
          title='OK'
          onPress={() => this.props.navigation.popToTop()}
        />
      </View>
      :
      <View style={styles.container}>
        <Image
          source={require('../assets/images/error.png')}
          style={styles.check}              
        />
        <StyledText style={styles.confirm}>
          We're sorry, we couldn't complete your order. Please try again later.
        </StyledText>
        <StyledButton
          buttonStyle={styles.button}
          title='OK'
          onPress={() => this.props.navigation.popToTop()}
        />
      </View>
    )
  }

  render() {
    return (
      <StyledScreen>
        {this._renderIndicator()}
      </StyledScreen>
    )
  }
}

const styles = StyleSheet.create({
  confirm: {
    textAlign: 'center',
    fontSize: 20,
    width: 280,
    marginBottom: 60,
  },
  button: {
    width: 200
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  check: {
    height: 75,
    width: 75,
    marginBottom: 40,
  }
});