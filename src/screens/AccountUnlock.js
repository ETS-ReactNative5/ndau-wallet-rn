import React, { Component } from 'react'

import {
  AccountUnlockContainer,
  AccountDetailPanel,
  AccountLargeText
} from '../components/account'
import AccountHistoryHelper from '../helpers/AccountHistoryHelper'
import LoggingService from '../services/LoggingService'
import FlashNotification from '../components/common/FlashNotification'
import WaitingForBlockchainSpinner from '../components/common/WaitingForBlockchainSpinner'
import { LargeButton } from '../components/common'
import AccountAPIHelper from '../helpers/AccountAPIHelper'
import DateHelper from '../helpers/DateHelper'
import { NotifyTransaction } from '../transactions/NotifyTransaction'
import { Transaction } from '../transactions/Transaction'

class AccountUnlock extends Component {
  constructor (props) {
    super(props)
    this.state = {
      accountHistory: {},
      account: {},
      wallet: {},
      spinner: false
    }
  }

  componentWillMount = async () => {
    this.setState({ spinner: true }, async () => {
      const account = this.props.navigation.getParam('account', null)
      const wallet = this.props.navigation.getParam('wallet', null)

      this.setState({ account, wallet, spinner: false })
    })
  }

  _initiateUnlock = async () => {
    Object.assign(NotifyTransaction.prototype, Transaction)
    const notifyTransaction = new NotifyTransaction(
      this.state.wallet,
      this.state.account
    )
    await notifyTransaction.createSignPrevalidateSubmit()

    this.props.navigation.navigate('WalletOverview', {
      wallet: this.state.wallet
    })
  }

  render () {
    const accountNoticePeriod = AccountAPIHelper.accountNoticePeriod(
      this.state.account.addressData
    )

    return (
      <AccountUnlockContainer
        title='Unlock account'
        navigation={this.props.nav}
        wallet={this.state.wallet}
        account={this.state.wallet}
        {...this.props}
      >
        <WaitingForBlockchainSpinner spinner={this.state.spinner} />
        <AccountDetailPanel>
          <AccountLargeText>
            Unlocking this account means you will be able to spend from it, but
            it will no longer accrue bonus inscentive (EAI). Are you sure you
            want to unlock?
          </AccountLargeText>
          <AccountLargeText>
            Funds from this account will be available to you in{' '}
            {accountNoticePeriod} days, on{' '}
            {DateHelper.addDaysToToday(accountNoticePeriod)}. Until then, you
            will not be able to add new ndau to this account.
          </AccountLargeText>
        </AccountDetailPanel>
        <LargeButton onPress={() => _initiateUnlock()}>
          Start unlock countdown
        </LargeButton>
      </AccountUnlockContainer>
    )
  }
}

export default AccountUnlock
