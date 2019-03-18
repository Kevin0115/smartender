import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Text,
  Alert,
  AsyncStorage
} from 'react-native';
import { StyledButton, StyledText, StyledScreen } from '../components/StyledElements';
import DrinkCard from '../components/DrinkCard';

import Drinks from '../constants/Drinks';

export default class HomeScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      drinkList: Drinks,
    }
  }

  render() {
    return (
      <StyledScreen stretch>
        <FlatList
          data={this.state.drinkList}
          numColumns={1}
          contentContainerStyle={styles.flatList}
          renderItem={({item}) => {
            return(
              <DrinkCard
                drinkInfo={item}
              />
            )
          }}
          keyExtractor={(item, index) => index.toString()}
        />
      </StyledScreen>
    );
  }
}

const styles = StyleSheet.create({
  flatList: {
    width: '100%',
    alignItems: 'center',
  },
});