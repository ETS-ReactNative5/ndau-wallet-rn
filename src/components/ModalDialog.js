import React, { Component } from 'react';

import { StyleSheet, Modal, View, TouchableHighlight, Text } from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import styleConstants from '../css/styleConstants';

class ModalDialog extends Component {
  render() {
    return (
      <Modal animationType="slide" transparent={true} onRequestClose={() => {}} {...this.props}>
        <View style={[ styles.outerView, this.props.outerViewStyle ]}>
          <View style={[ styles.innerView, this.props.innerViewStyle ]}>
            <TouchableHighlight
              onPress={() => {
                this.props.setModalVisible(false);
              }}
            >
              <FontAwesome
                style={styles.closeButton}
                name="close"
                color={styleConstants.ICON_GRAY}
                size={20}
              />
            </TouchableHighlight>
            {this.props.children}
          </View>
        </View>
      </Modal>
    );
  }
}

var styles = StyleSheet.create({
  outerView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  innerView: {
    backgroundColor: '#333333',
    borderRadius: 3,
    width: wp('90%'),
    height: hp('70%'),
    paddingLeft: wp('2%'),
    paddingRight: wp('2%'),
    paddingBottom: hp('2%')
  },
  closeButton: {
    marginTop: hp('.5%'),
    marginLeft: wp('1%')
  }
});

export default ModalDialog;
