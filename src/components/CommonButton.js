import React, { Component } from 'react';

import { StyleSheet } from 'react-native';
import { TextButton } from 'react-native-material-buttons';

class CommonButton extends Component {
  render() {
    return (
      <TextButton
        titleStyle={styles.text}
        color="#4e957a"
        titleColor="#ffffff"
        disabledColor="#696969"
        {...this.props}
      />
    );
  }
}

var styles = StyleSheet.create({
  text: {
    color: '#ffffff',
    fontSize: 14,
    fontFamily: 'TitilliumWeb-Regular'
  }
});

export default CommonButton;
