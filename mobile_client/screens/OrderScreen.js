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
    setTimeout(() => {
      this.props.navigation.popToTop();
    }, 3000)
  }

  render() {
    return(
      <StyledScreen>
        <StyledText style={styles.confirm}>
          Thank you!{'\n'}Your {this.state.orderInfo.drinkName} will be poured shortly.
        </StyledText>
      </StyledScreen>
    );
  }
}

const styles = StyleSheet.create({
  confirm: {
    textAlign: 'center',
    fontSize: 20,
    width: 280,
  },
});