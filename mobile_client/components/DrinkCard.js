import React from 'react';
import {
  Image,
  AsyncStorage,
  Text,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Icon, colors } from 'react-native-elements';
import { withNavigation } from 'react-navigation';
import { StyledButton, StyledText } from '../components/StyledElements';
import Colors from '../constants/Colors';

class DrinkCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drinkName: '',
    }
  }

  render() {
    return(
      <TouchableOpacity
        style={styles.groupCard}
        onPress={() => this.props.navigation.navigate('Drink', {drinkInfo: this.props.drinkInfo})}
      >
        <Image
          style={styles.image}
          source={this.props.drinkInfo.uri}
        />
        <View style={styles.content}>
          <StyledText style={styles.title} bold>
            {this.props.drinkInfo.name}
          </StyledText>
          <StyledText style={styles.price}>
            ${this.props.drinkInfo.price.toFixed(2)}
          </StyledText>
        </View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  groupCard: {
    display: 'flex',
    flexDirection: 'row',
    height: 120,
    width: 340,
    marginBottom: 16,
    padding: 12,
    borderRadius: 4,
    backgroundColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0, .4)',
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 2,
      },
      android: {
        backgroundColor: '#fff',
        elevation: 2,
      },
    }),
  },
  image: {
    height: 85,
    width: 85,
    marginRight: 20,
  },
  content: {
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
  }
});

export default withNavigation(DrinkCard);