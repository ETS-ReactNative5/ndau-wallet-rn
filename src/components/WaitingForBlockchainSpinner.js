import React, { Component } from 'react'
import { StyleSheet } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import Spinner from 'react-native-loading-spinner-overlay'

class WaitingForBlockchainSpinner extends Component {
  render () {
    return (
      <Spinner
        visible={this.props.spinner}
        textContent={'Talking to blockchain...'}
        textStyle={{
          color: '#ffffff',
          fontSize: 20,
          fontFamily: 'TitilliumWeb-Light'
        }}
        animation='fade'
        overlayColor='rgba(0, 0, 0, 0.7)'
      />
    )
  }
}

export default WaitingForBlockchainSpinner
