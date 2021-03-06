import React from 'react';
import {
  Image,
  Text,
  StyleSheet,
  View,
  Alert,
  AsyncStorage
} from 'react-native';
import { Camera, Permissions } from 'expo';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { StyledButton, StyledText, StyledScreen } from '../components/StyledElements';

export default class ScanScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Camera State
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      focus: Camera.Constants.AutoFocus.on,

      // QR Scanner
      id: null,
      message: 'No Smartender Scanned',

      // Order Info
      orderInfo: this.props.navigation.getParam('orderInfo'),
      username: ''
    }
    this._scanCode = this._scanCode.bind(this);
    this._handleOrder = this._handleOrder.bind(this);
  }

  async componentDidMount() {
    this._retrieveData();
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted'});
  }

  _retrieveData = async () => {
    const userData = JSON.parse(await AsyncStorage.getItem('fbUser'));
    this.setState({username: userData.name});
  }

  _scanCode(arg) {
    try {
      var qr = JSON.parse(arg.data);
      if (qr.smartender_id != null || qr.smartender_id != undefined) {
        this.setState({
          id: qr.smartender_id,
          message: 'Smartender #' + qr.smartender_id + ' Scanned'
        });
      }
    } catch (e) {
      console.log('Not a Smartender ID');
    }
  }

  _renderCheck() {
    return (
      this.state.id == null ?
      null
      :
      <Image
        source={require('../assets/images/success.png')}
        style={styles.check}              
      />
    )
  }

  _handleOrder() {
    const orderInfo = {
      username: this.state.username,
      machine_id: this.state.id,
      drink_id: this.state.orderInfo.drinkId,
      shots: this.state.orderInfo.shots,
      name: this.state.orderInfo.name,
      price: this.state.orderInfo.price
    }
    if (typeof this.state.id === 'number') {
      this.props.navigation.navigate('Order', {orderInfo: orderInfo});
    } else {
      Alert.alert('Please Scan a Smartender before Proceeding!')
    }
  }

  // Render any loading content that you like here
  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <StyledScreen />;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <StyledScreen>
          <StyledText style={styles.instructions}>
            Find the QR Code on a Smartender and scan it with your phone.
          </StyledText>
          <View style={{ flex: 3 }}>
            <Camera
              style={styles.scanner}
              type={this.state.type}
              autoFocus={this.state.focus}
              onBarCodeScanned={this._scanCode}
            >
              {this._renderCheck()}
            </Camera>
          </View>
          <StyledText style={styles.instructions}>
            {this.state.message}
          </StyledText>
          <View style={styles.buttonContainer}>
            <StyledButton
              buttonStyle={styles.button}
              title={'Order - $' + this.state.orderInfo.price.toFixed(2)}
              onPress={this._handleOrder}
            />
          </View>
        </StyledScreen>
      );
    }
  }
}

const styles = StyleSheet.create({
  scanner: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 280,
    width: 280,
  },
  instructions: {
    textAlign: 'center',
    flex: 1,
    fontSize: 16,
    marginTop: 30,
    width: 280,
  },
  buttonContainer: {
    flex: 1,
  },
  button: {
    backgroundColor: '#53c16d',
    width: 254,
    height: 56,
  },
  check: {
    width: 100,
    height: 100,
  }
});