import React, { Component } from 'react'
import {
  AccountLockContainer,
  AccountLockDetailsPanel,
  AccountLockLargerText,
  AccountBorder,
  AccountIconText,
  AccountLockConfirmBottomPanel
} from '../components/account'
import { LockTransaction } from '../transactions/LockTransaction'
import { Transaction } from '../transactions/Transaction'
import { NotifyTransaction } from '../transactions/NotifyTransaction'
import AccountStore from '../stores/AccountStore'
import WalletStore from '../stores/WalletStore'
import AppConstants from '../AppConstants'

class AccountLockConfirmation extends Component {
  constructor (props) {
    super(props)
    this.state = {
      account: {},
      wallet: {},
      lockInformation: {},
      accountAddressForEAI: null,
      accountNicknameForEAI: null,
      confirmed: false,
      word: null,
      spinner: false
    }
  }

  componentWillMount = () => {
    const account = AccountStore.getAccount()
    const wallet = WalletStore.getWallet()
    const lockInformation = this.props.navigation.getParam(
      'lockInformation',
      null
    )
    const accountAddressForEAI = this.props.navigation.getParam(
      'accountAddressForEAI',
      null
    )
    const accountNicknameForEAI = this.props.navigation.getParam(
      'accountNicknameForEAI',
      null
    )

    this.setState({
      account,
      wallet,
      lockInformation,
      accountAddressForEAI,
      accountNicknameForEAI
    })
  }

  _lock = async () => {
    this.setState({ spinner: true }, async () => {
      Object.assign(LockTransaction.prototype, Transaction)
      const lockTransaction = new LockTransaction(
        this.state.wallet,
        this.state.account,
        `${this.state.lockInformation.lock}m`
      )
      await lockTransaction.createSignPrevalidateSubmit()

      // Alright, we are locked...now send a Notify
      // This was done in version 2.0 to simplify the lock
      // process.
      const notifyTransaction = new NotifyTransaction(
        this.state.wallet,
        this.state.account
      )
      await notifyTransaction.createSignPrevalidateSubmit()

      this.props.navigation.navigate('WalletOverview', {
        wallet: this.state.wallet,
        refresh
      })
      this.setState({ spinner: true })
    })
  }

  _goBack = () => {
    this.props.navigation.goBack()
  }

  _checkWord = word => {
    let confirmed = false
    if (word === 'Lock') {
      confirmed = true
    }
    this.setState({ confirmed, word })
  }

  render () {
    return (
      <AccountLockContainer
        title='Lock account'
        account={this.state.account}
        wallet={this.state.wallet}
        navigation={this.props.nav}
        {...this.props}
      >
        <AccountLockDetailsPanel account={this.state.account}>
          <AccountLockLargerText>Confirmation</AccountLockLargerText>
          <AccountBorder sideMargins />
          <AccountIconText>
            Lock {this.state.account.addressData.nickname}
          </AccountIconText>
          <AccountIconText>
            Earn {this.state.lockInformation.bonus}% EAI bonus +{' '}
            {this.state.lockInformation.base}% base ={' '}
            {this.state.lockInformation.total}% total
          </AccountIconText>
          <AccountIconText>
            Sending EAI to {this.state.accountNicknameForEAI}
          </AccountIconText>
          <AccountIconText>
            Account will unlock in {this.state.lockPeriod} months
          </AccountIconText>
          <AccountIconText
            iconColor={AppConstants.WARNING_ICON_COLOR}
            iconName='exclamation-circle'
          >
            You will not be able to deposit into, spend, transfer, or otherwise
            access the principal in this account while it is locked
          </AccountIconText>
        </AccountLockDetailsPanel>

        <AccountLockConfirmBottomPanel
          disabled={!this.state.confirmed}
          onPress={this._lock}
          onChangeText={this._checkWord}
          word={this.state.word}
        >
          Confirm
        </AccountLockConfirmBottomPanel>
      </AccountLockContainer>
    )
  }
}

export default AccountLockConfirmation
