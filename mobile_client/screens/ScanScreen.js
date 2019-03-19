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
  AsyncStorage
} from 'react-native';
import { Camera, Permissions, BarCodeScanner } from 'expo';
import { StyledButton, StyledText, StyledScreen } from '../components/StyledElements';

export default class ScanScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // Camera State
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
      focus: Camera.Constants.AutoFocus.on,
      // Other
      id: null,
      orderInfo: this.props.navigation.getParam('orderInfo'),
    }
    this._scanCode = this._scanCode.bind(this);
    this._handleOrder = this._handleOrder.bind(this);
  }

  async componentDidMount() {
    console.log(this.state.orderInfo);
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({
      hasCameraPermission: status === 'granted'});
  }

  _scanCode(arg) {
    this.setState({id: arg.data});
  }

  _renderID() {
    return (
      this.state.id == null ?
      <StyledText style={styles.instructions}>
        No Smartender Scanned
      </StyledText>
      :
      <StyledText style={styles.instructions}>
        Scanned Smartender #{this.state.id}
      </StyledText>
    );
  }

  _handleOrder() {
    // CALL THE API; NEED TO CHECK IF BUSY SO MAYBE DON'T NAVIGATE
    fetch('http://ec2-13-58-113-143.us-east-2.compute.amazonaws.com/orders/test', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "machine_id": 0,
	"drink_id": 0,
	"name": "Bloody Mary",
	"shots": 1,
	"username": "Kevin"
      })
    })
    .then(res => res.text())
    .then(text => console.log(text))
    .catch(function(error) {
      console.log('There has been a problem with your fetch operation: ' + error.message);
       // ADD THIS THROW error
        throw error;
      });
    if (this.state.id) {
      
      this.props.navigation.navigate(
        'Order',
        {orderInfo:
          {
            machineId: this.state.id,
            drinkId: this.state.orderInfo.drinkId,
            shots: this.state.orderInfo.shots,
            drinkName: this.state.orderInfo.name,
          }
      })
    } else {
      // Alert.alert('Please Scan a Smartender before Proceeding!')
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
            <BarCodeScanner
              style={styles.scanner}
              type={this.state.type}
              autoFocus={this.state.focus}
              onBarCodeScanned={this._scanCode}
            />
          </View>
          {this._renderID()}
          <View style={styles.buttonContainer}>
            <StyledButton
              buttonStyle={styles.button}
              title='Order'
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
    width: 200,
  }
});