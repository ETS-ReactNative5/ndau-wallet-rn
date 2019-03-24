import React, { Component } from 'react'

import {
  AccountUnlockContainer,
  AccountDetailPanel,
  AccountParagraphText
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
import AccountStore from '../stores/AccountStore'
import WalletStore from '../stores/WalletStore'

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
    const account = AccountStore.getAccount()
    const wallet = WalletStore.getWallet()

    this.setState({ account, wallet })
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
        account={this.state.account}
        {...this.props}
      >
        <WaitingForBlockchainSpinner spinner={this.state.spinner} />
        <AccountDetailPanel>
          <AccountParagraphText>
            Unlocking this account means you will be able to spend from it, but
            it will no longer accrue bonus incentive (EAI). Are you sure you
            want to unlock?
          </AccountParagraphText>
          <AccountParagraphText>
            Funds from this account will be available to you in{' '}
            {accountNoticePeriod} days, on{' '}
            {DateHelper.addDaysToToday(accountNoticePeriod)}. Until then, you
            will not be able to add new ndau to this account.
          </AccountParagraphText>
        </AccountDetailPanel>
        <LargeButton onPress={() => this._initiateUnlock()}>
          Start unlock countdown
        </LargeButton>
      </AccountUnlockContainer>
    )
  }
}

export default AccountUnlock
