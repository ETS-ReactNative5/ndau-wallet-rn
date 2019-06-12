import React, { Component } from 'react'

import { StyleSheet, Text, View } from 'react-native'
import Button from 'react-native-button'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import Padding from './Padding'
import Icon from 'react-native-fontawesome-pro'

class CommonButton extends Component {
  onPress () {
    this.props.onPress()
  }
  render () {
    const { bottomPadding } = this.props

    return (
      <Padding
        bottom={bottomPadding === 0 ? 0 : bottomPadding || 1}
        {...this.props}
      >
        <View style={styles.containerStyle}>
          <Button
            style={styles.text}
            disabledContainerStyle={styles.disabledStyle}
            containerStyle={styles.containerStyle}
            onPress={this.props.onPress}
            {...this.props}
          >
            <Text style={styles.text}>
              {// "name" is required
                this.props.iconProps && this.props.iconProps.name && (
                  <Text>
                    <Icon {...this.props.iconProps} color='#fff' />
                    {'  '}
                  </Text>
                )}
              {this.props.title}
            </Text>
          </Button>
        </View>
      </Padding>
    )
  }
}

var styles = StyleSheet.create({
  text: {
    color: '#ffffff',
    fontSize: 16,
    fontFamily: 'TitilliumWeb-Regular',
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  disabledStyle: {
    backgroundColor: '#696969'
  },
  containerStyle: {
    alignContent: 'center',
    justifyContent: 'center',
    borderRadius: 3,
    height: hp('6%'),
    backgroundColor: '#4e957a'
  }
})

export default CommonButton
