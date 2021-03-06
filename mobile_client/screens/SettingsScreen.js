import React from 'react';
import {
  Image,
  StyleSheet,
  View,
  Alert,
  AsyncStorage,
  Button,
  ActivityIndicator
} from 'react-native';
import Modal from 'react-native-modal';
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
      drinkCount: '  ',
      balance: 0,
      walletID: '',
      walletAddress: '',
      modalVisible: false,
      addFund: '',
      spinnerVisible: false,
      disableButton: false,
    }
    this._toggleModal = this._toggleModal.bind(this);
    this._handleMine = this._handleMine.bind(this);
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
    .then(json => this.setState({
      drinkCount: json.drink_count,
      walletID: json.wallet.id,
      walletAddress: json.wallet.addresses[0],
    }))
    .catch(function(error) {
      console.log('Error: ' + error.message);
      throw error;
    });

    fetch(BASE_URL + '/users/' + userData.id + '/balance', {
      method: 'GET',
    })
    .then(res => res.json())
    .then(json => this.setState({
      balance: json.balance,
    }))
    .catch(function(error) {
      console.log('Error: ' + error.message);
      throw error;
    });

    this.setState({
      userName: userData.name,
      userID: userData.id,
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

  _toggleModal() {
    this.setState({
      modalVisible: !this.state.modalVisible,
      addFund: '',
    });
  }

  _handleMine() {
    this.setState({
      spinnerVisible: true,
      disableButton: true,
    })

    fetch(BASE_URL + '/users/' + this.state.userID + '/wallet', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        walletAddress: this.state.walletAddress,
        reward: true
      })
    })
    .then(res => res.json())
    .then(json => {
      setTimeout(() => {
        this._retrieveData();
        this.setState({spinnerVisible: false});
        this._toggleModal();
      }, 1000);
      setTimeout(() => {
        this.setState({disableButton: false});
      }, 3600000);
    })
    .catch(function(error) {
      this.setState({
        spinnerVisible: false,
        disableButton: false,
      })
      console.log('Error: ' + error.message);
      throw error;
    });
  }

  // async _handleAddFund() {
  //   this.setState({spinnerVisible: true})
  //   console.log(this.state.addFund);
  //   const userData = JSON.parse(await AsyncStorage.getItem('fbUser'));
  //   // API Call to Update Balance
  //   fetch(BASE_URL + '/users/' + userData.id + '/balance', {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     // Negative because API subtracts by default
  //     body: JSON.stringify({price: -1*parseInt(this.state.addFund)})
  //   })
  //   .then(res => res.json())
  //   .then(json => {
  //     console.log(json);
  //     setTimeout(() => {
  //       this._retrieveData();
  //       this.setState({spinnerVisible: false});
  //       this._toggleModal();
  //     }, 1000);
  //   })
  //   .catch(function(error) {
  //     console.log('Error: ' + error.message);
  //     throw error;
  //   });
  // }

  _renderUserInfo() {
    return (
      this.state.isGuest ? 
      <View style={{flex: 2}}>
        <StyledText style={{flex: 1, fontSize: 18, color: 'green'}}>
          Please Drink Responsibly!
        </StyledText>
      </View>
      :
      <View style={styles.contentContainer}>
        <StyledText style={{flex: 1, fontSize: 18, marginBottom: 20}}>
          Drinks Ordered: {this.state.drinkCount}
        </StyledText>
        <View style={{flex: 2, marginBottom: 20}}>
          <StyledText style={{fontSize: 18}}>
            BarCoin Balance: ${this.state.balance.toFixed(2)}
          </StyledText>
          <Button
            title='Add Funds'
            style={styles.addFunds}
            onPress={this._toggleModal}
          />
        </View>
        <StyledText style={{flex: 1, fontSize: 18, color: 'green'}}>
          Please Drink Responsibly!
        </StyledText>
      </View>
    )
  }

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
        {this._renderUserInfo()}
        <View style={{flex: 1}} />
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
            title='Back'
            onPress={() => this.props.navigation.popToTop()}
          />
        </View>
        <Modal
          isVisible={this.state.modalVisible}
          backdropOpacity={0.7}
          style={styles.modalStyle}
        >
          <View style={styles.modalContent}>
            {/*Add fund adding logic HERE!!!*/}
            <StyledText style={{fontSize: 20, marginBottom: 20}}>
              Add Funds
            </StyledText>
            <StyledText style={{textAlign: 'center', marginBottom: 20}}>
              In order to receive more funds,
              you must "mine" more blocks in the blockchain to receive more BarCoin as a reward.
              You are limited to 1 mine per hour.
            </StyledText>
            <ActivityIndicator animating={this.state.spinnerVisible} size='large' color='#0000ff' />
            <View style={{height: 20}} />
            <StyledButton
              disabled={this.state.disableButton}
              buttonStyle={styles.mineButton}
              onPress={this._handleMine}
              title='Mine'
            />
            <Button
              title='Cancel'
              onPress={this._toggleModal}
              color='red'
            />
          </View>
        </Modal>
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
  contentContainer: {
    display: 'flex',
    flex: 2,
    alignItems: 'center',
    justifyContent: 'space-evenly',
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
  },
  modalStyle: {
    top: -100
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  mineButton: {
    width: 180
  }
});