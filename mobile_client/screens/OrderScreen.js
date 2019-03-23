import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  AsyncStorage,
  ActivityIndicator
} from 'react-native';
import { LOCALHOST, BASE_URL } from '../constants/Auth';
import { StyledButton, StyledText, StyledScreen } from '../components/StyledElements';


export default class OrderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      status: true,
      orderInfo: this.props.navigation.getParam('orderInfo'),
      response: false,
    }
    this._renderIndicator = this._renderIndicator.bind(this);
    this._renderMessage = this._renderMessage.bind(this);
    this._updateDrinkCount = this._updateDrinkCount.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({response: true});
    }, 2000)
    fetch(BASE_URL + 'orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.props.navigation.getParam('orderInfo'))
    })
    .then(res => res.json())
    // .then(json => console.log("\nYour Order:\n\n" + JSON.stringify(json)))
    .then(json => this.setState({status: json.status !== 'No Inventory'}))
    .then(setTimeout(() => {
      this._updateDrinkCount();
    }, 2000))
    // For drink counting purposes
    .catch(function(error) {
      console.log('Error: ' + error.message);
      throw error;
    });
  }

  _updateDrinkCount() {
    console.log(this.state.status);
    if (this.state.status) {
      AsyncStorage.getItem('drinkCount')
      .then(count => {
        if (count !== null) {
          AsyncStorage.setItem('drinkCount', JSON.stringify(++count));
        } else {
          AsyncStorage.setItem('drinkCount', JSON.stringify(1));
        }
      });
    }
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

  _renderMessage() {    
    return (
      this.state.status ?
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
          We're sorry, we're currently out of this drink. Please try again later.
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