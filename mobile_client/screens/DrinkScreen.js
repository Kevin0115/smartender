import React from 'react';
import {
  Image,
  Platform,
  StyleSheet,
  View,
  FlatList,
} from 'react-native';
import { StyledButton, StyledText, StyledScreen } from '../components/StyledElements';

export default class DrinkScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      price: 0,
      ingredients: [],
      image: {},
      shots: 1,
    }
  }

  _handleCustom(shots) {
    const originalPrice = this.props.navigation.getParam('drinkInfo').price;
    if (shots === 2) {
      this.setState({price: originalPrice + 2});
    } else if (shots === 0) {
      this.setState({price: originalPrice - 1});
    } else {
      this.setState({price: originalPrice});
    }
    this.setState({shots: shots});
  }

  componentDidMount() {
    const drinkInfo = this.props.navigation.getParam('drinkInfo');
    this.setState({
      name: drinkInfo.name,
      price: drinkInfo.price,
      ingredients: drinkInfo.ingredients,
      image: drinkInfo.uri,
      drinkId: drinkInfo.drinkId
    });
  }

  render() {
    return (
      <StyledScreen>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={this.state.image}
          />
        </View>
        <StyledText style={styles.title} bold>
          {this.state.name}
        </StyledText>
        <View style={styles.listContainer}>
          <FlatList
            contentContainerStyle={styles.ingredientList}
            data={this.state.ingredients}
            renderItem={({item}) => <StyledText style={styles.ingredient}>{item}</StyledText>}
            keyExtractor={(item, index) => index.toString()}
          />
        </View>
        <StyledText style={styles.customize} bold>
          Customize your Drink
        </StyledText>
        <View style={styles.buttonContainer}>
          <View>
            <StyledButton
              buttonStyle={styles.customButton}
              titleStyle={styles.buttonTitle}
              title='Double'
              onPress={() => this._handleCustom(2)}
            />
          </View>
          <View>
            <StyledButton
              buttonStyle={styles.customButton}
              titleStyle={styles.buttonTitle}
              title='Regular'
              onPress={() => this._handleCustom(1)}
            />
          </View>
          <View>
            <StyledButton
              buttonStyle={styles.customButton}
              titleStyle={styles.buttonTitle}
              title='Virgin'
              onPress={() => this._handleCustom(0)}
            />
          </View>
        </View>
        <StyledText style={styles.customize}>
          Number of Shots: {this.state.shots}
        </StyledText>
        <View style={{flex: 1.5, marginTop: 20}}>
          <StyledButton
            buttonStyle={styles.proceed}
            title={'Proceed - $' + this.state.price.toFixed(2)}
            onPress={() => this.props.navigation.navigate('Scan', {orderInfo: this.state})}
          />
        </View>
      </StyledScreen>
    );
  }
}

const styles = StyleSheet.create({
  imageContainer: {
    flex: 3,
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
    height: 180,
    width: 180,
    borderRadius: 8,
    margin: 20,
    
  },
  title: {
    flex: 0.7,
    fontSize: 20,
    paddingTop: 10,
  },
  listContainer: {
    flex: 2.5,
    alignItems: 'center',
  },
  ingredientList: {
    alignItems: 'center',
  },
  ingredient: {
    marginBottom: 4,
    fontSize: 16,
  },
  customize: {
    flex: 0.7,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    width: 300,
    justifyContent: 'space-between',
  },
  proceed: {
    backgroundColor: '#53c16d',
    width: 254,
    height: 56,
  },
  buttonTitle: {
    fontSize: 16,
  },
  customButton: {
    width: 90,
  }
});