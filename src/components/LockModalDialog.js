import React, { Component } from 'react'

import { StyleSheet, Text } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import ModalDialog from './ModalDialog'
import CommonButton from '../components/CommonButton'
import Transaction from '../transactions/Transaction'

class LockModalDialog extends Component {
  constructor (props) {
    super(props)

    this.state = {
      period: '3m'
    }
  }

  setWallet = wallet => {
    this._wallet = wallet
  }

  setAccount = account => {
    this._account = account
  }

  _lock = async () => {
    if (!this._wallet && !this._account) {
      return
    }
    const transaction = new Transaction(
      this._wallet,
      this._account,
      'Lock',
      this.state.period
    )
    await transaction.create()
    await transaction.sign()
    await transaction.prevalidate()
    await transaction.submit()

    this.closeModal()
  }

  showModal = () => {
    this._modalDialog.showModal()
  }

  closeModal = () => {
    this._modalDialog.closeModal()
  }

  render () {
    return (
      <ModalDialog
        ref={component => (this._modalDialog = component)}
        {...this.props}
      >
        <Text style={styles.text}>This is lock dialog</Text>
        <CommonButton title='Lock' onPress={this._lock} />
      </ModalDialog>
    )
  }
}

var styles = StyleSheet.create({
  text: {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'TitilliumWeb-Regular',
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
    marginLeft: wp('1%'),
    marginRight: wp('1%')
  }
})

export default LockModalDialog
