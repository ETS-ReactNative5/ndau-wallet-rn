import React, { Component } from 'react'
import { StyleSheet, Modal, View, TouchableHighlight, Text } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro'
import Padding from './Padding'
import styleConstants from '../../css/styleConstants'

class ModalDialog extends Component {
  constructor (props) {
    super(props)

    this.state = {
      visible: false
    }
  }

  showModal = () => {
    this.setState({ visible: true })
  }

  closeModal = () => {
    this.setState({ visible: false })
  }

  render () {
    return (
      <Modal
        animationType='slide'
        transparent
        onRequestClose={() => {}}
        visible={this.state.visible}
        {...this.props}
      >
        <View style={[styles.outerView, this.props.outerViewStyle]}>
          <View style={[styles.innerView, this.props.innerViewStyle]}>
            <Padding top={0.5}>
              <TouchableHighlight onPress={this.closeModal}>
                <FontAwesome5Pro
                  style={styles.closeButton}
                  name='times'
                  color={styleConstants.ICON_GRAY}
                  size={20}
                  light
                />
              </TouchableHighlight>
            </Padding>
            {this.props.children}
          </View>
        </View>
      </Modal>
    )
  }
}

var styles = StyleSheet.create({
  outerView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  innerView: {
    backgroundColor: '#0F2748',
    borderRadius: 3,
    width: wp('90%'),
    height: hp('60%'),
    paddingLeft: wp('3%'),
    paddingRight: wp('3%'),
    marginTop: hp('20%')
  },
  closeButton: {}
})

export default ModalDialog
