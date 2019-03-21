import React from 'react';
import { Keyboard, StyleSheet, Text, View, TextInput, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import Colors from '../constants/Colors';

export class StyledButton extends React.Component {
  render() {
    return(
      <Button
        {...this.props}
        buttonStyle={[
          this.props.buttonStyle,
          (this.props.picker) ? styles.styledPickerButton : styles.styledButton,
        ]}
        titleStyle={[this.props.titleStyle, styles.styledTitle]}
        raised={true}
      />
    );
  }
}

export class StyledText extends React.Component {
  render() {
    return(
      <Text
        {...this.props}
        style={[
          this.props.style,
          (this.props.bold) ? styles.styledTextBold : styles.styledText,
          (this.props.whiteText) ? styles.whiteText : null,
        ]}
      />
    );
  }
}


export class StyledScreen extends React.Component {
  render() {
    return(
      <View
        {...this.props}
        style={this.props.stretch ? styles.styledScreenStretch : styles.styledScreen}
      />
    );
  }
}

export class StyledTextInput extends React.Component {
  render() {
    return(
      <TextInput
        {...this.props}
        style={[
          this.props.style,
          styles.styledTextInput
        ]}
        placeholderTextColor={'gray'}
        blurOnSubmit={true}
        onSubmitEditing={Keyboard.dismiss}
      />
    );
  }
}

export class StyledDatePicker extends React.Component {
  render() {
    const today = new Date();
    return(
      <DateTimePicker
        {...this.props}
        mode='date'
        minimumDate={today}
      />
    );
  }
}

const styles = StyleSheet.create({
  styledText: {
    fontFamily: 'cabin'
  },
  styledTextBold: {
    fontFamily: 'cabin-bold'
  },
  whiteText: {
    color: '#fff',
  },
  styledTextInput: {
    fontSize: 16,
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 20,
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0,0,0, .4)',
        shadowOffset: { height: 1, width: 1 },
        shadowOpacity: 1,
        shadowRadius: 1,
      },
      android: {
        backgroundColor: '#fff',
        elevation: 2,
      },
    }),
  },
  styledButton: {
    // backgroundColor: Colors.white,
  },
  styledPickerButton: {
    backgroundColor: Colors.themeYellow,
  },
  styledTitle: {
    fontFamily: 'cabin',
  },
  styledScreen: {
    flex: 1,
    display: 'flex',
    backgroundColor: Colors.themeWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  styledScreenStretch: {
    flex: 1,
    display: 'flex',
    backgroundColor: Colors.themeWhite,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
});