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
import { StyledButton, StyledText, StyledScreen } from '../components/StyledElements';


export default class OrderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderInfo: this.props.navigation.getParam('orderInfo'),
    }
  }

  componentDidMount() {
    // setTimeout(() => {
    //   this.props.navigation.popToTop();
    // }, 5000)
  }

  render() {
    return(
      <StyledScreen>
        <StyledText style={styles.confirm}>
          Thank you!{'\n'}Your {this.state.orderInfo.name} will be poured shortly.
        </StyledText>
        <StyledButton
          buttonStyle={styles.button}
          title='OK'
          onPress={() => this.props.navigation.popToTop()}
        />
      </StyledScreen>
    );
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
  }
});