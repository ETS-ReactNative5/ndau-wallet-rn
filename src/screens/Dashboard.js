import React, { Component } from 'react'
import { SafeAreaView } from 'react-navigation'
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  RefreshControl,
  TouchableOpacity
} from 'react-native'
import cssStyles from '../css/styles'
import DateHelper from '../helpers/DateHelper'
import NdauNodeAPIHelper from '../helpers/NdauNodeAPIHelper'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import AccountCard from '../components/AccountCard'
import UnlockModalDialog from '../components/UnlockModalDialog'
import LockModalDialog from '../components/LockModalDialog'
import NewAccountModalDialog from '../components/NewAccountModalDialog'
import TransactionModalDialog from '../components/TransactionModalDialog'
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro'
import styleConstants from '../css/styleConstants'
import KeyAddrGenManager from '../keyaddrgen/KeyAddrGenManager'
import MultiSafeHelper from '../helpers/MultiSafeHelper'
import UserData from '../model/UserData'
import FlashNotification from '../components/FlashNotification'
import Padding from '../components/Padding'
import OrderNodeAPI from '../api/OrderNodeAPI'
import DataFormatHelper from '../helpers/DataFormatHelper'
import AsyncStorageHelper from '../model/AsyncStorageHelper'

const LOCK_MODAL_ID = 'lock'
const UNLOCK_MODAL_ID = 'unlock'
const NEW_ACCOUNT_MODAL_ID = 'newAccount'
const TRANSACTION_MODAL_ID = 'transaction'
const NDAU_GREEN = require('img/ndau-icon-green.png')

class Dashboard extends Component {
  constructor (props) {
    super(props)

    this.state = {
      modalId: null,
      number: 1,
      activeAddress: null,
      user: {},
      refreshing: false,
      marketPrice: 0
    }

    this.isTestNet = false
  }

  componentWillMount = async () => {
    const user = this.props.navigation.getParam('user', {})
    console.debug(`User to be drawn: ${JSON.stringify(user, null, 2)}`)

    const marketPrice = this.props.navigation.getParam('marketPrice', 0)
    this.setState({ user, marketPrice })
    this.isTestNet = await AsyncStorageHelper.isTestNet()
    // if (this.isTestNet) console.log(`TESTNET IS ${this.isTestNet}`)
  }

  showModal = modalId => {
    this.setState({ modalId })
  }

  closeModal = () => {
    this.setState({ modalId: null })
  }

  subtractNumber = () => {
    if (this.state.number > 1) {
      this.setState({ number: (this.state.number -= 1) })
    }
  }

  addNumber = () => {
    this.setState({ number: (this.state.number += 1) })
  }

  unlock = () => {
    // TODO: This is for issue #28 and #29 for MVP
    // This is being commented out for now as we want the
    // icons, but don't want the actual implementation yet
    // this.setState({ unlockModalVisible: true });
  }

  lock = () => {
    // TODO: This is for issue #28 and #29 for MVP
    // This is being commented out for now as we want the
    // icons, but don't want the actual implementation yet
    // this.setState({ lockModalVisible: true });
  }

  launchAddNewAccountDialog = () => {
    this.showModal(NEW_ACCOUNT_MODAL_ID)
  }

  addNewAccount = async () => {
    try {
      const user = await KeyAddrGenManager.createNewAccount(
        this.state.user,
        this.state.number
      )

      await MultiSafeHelper.saveUser(
        user,
        this.props.navigation.getParam('encryptionPassword', null)
      )

      this.setState({ user })
    } catch (error) {
      FlashNotification.showError(
        `Problem adding new account: ${error.message}`
      )
    }
  }

  _onRefresh = async () => {
    this.setState({ refreshing: true })

    const user = this.state.user
    let marketPrice = this.state.marketPrice
    try {
      await UserData.loadData(user)
      marketPrice = await OrderNodeAPI.getMarketPrice()
    } catch (error) {
      FlashNotification.showError(error.message, false, false)
    }

    this.setState({ refreshing: false, user, marketPrice })
  }

  render = () => {
    const accounts = DataFormatHelper.getObjectWithAllAccounts(this.state.user)
    if (!accounts) {
      return <SafeAreaView style={cssStyles.safeContainer} />
    }

    const totalNdau = NdauNodeAPIHelper.accountTotalNdauAmount(accounts)
    const totalNdauNumber = NdauNodeAPIHelper.accountTotalNdauAmount(
      accounts,
      false
    )
    const currentPrice = NdauNodeAPIHelper.currentPrice(
      this.state.marketPrice,
      totalNdauNumber
    )

    const numberOfAccounts = Object.keys(accounts).length

    return (
      <SafeAreaView style={cssStyles.safeContainer}>
        <UnlockModalDialog
          visible={this.state.modalId === UNLOCK_MODAL_ID}
          setModalVisible={() => this.showModal(UNLOCK_MODAL_ID)}
          closeModal={this.closeModal}
        />
        <LockModalDialog
          visible={this.state.modalId === LOCK_MODAL_ID}
          setModalVisible={() => this.showModal(LOCK_MODAL_ID)}
          closeModal={this.closeModal}
        />
        <NewAccountModalDialog
          number={this.state.number}
          subtractNumber={this.subtractNumber}
          addNumber={this.addNumber}
          addNewAccount={this.addNewAccount}
          visible={this.state.modalId === NEW_ACCOUNT_MODAL_ID}
          setModalVisible={() => this.showModal(NEW_ACCOUNT_MODAL_ID)}
          closeModal={this.closeModal}
        />
        <TransactionModalDialog
          visible={this.state.modalId === TRANSACTION_MODAL_ID}
          setModalVisible={() => this.showModal(TRANSACTION_MODAL_ID)}
          closeModal={this.closeModal}
          address={this.state.activeAddress || this.props.activeAddress}
        />

        <StatusBar barStyle='light-content' backgroundColor='#1c2227' />
        <View style={cssStyles.container}>
          <ScrollView
            style={cssStyles.contentContainer}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <Padding top={0}>
              <View style={cssStyles.dashboardTextContainer}>
                {this.isTestNet ? (
                  <Text
                    style={[
                      cssStyles.dashboardTextSmallWhiteEnd,
                      { color: styleConstants.LINK_ORANGE }
                    ]}
                  >
                    TestNet
                  </Text>
                ) : null}
                <Text style={cssStyles.dashboardTextLarge}>Wallets</Text>
              </View>
            </Padding>

            <Padding>
              <View style={cssStyles.dashboardTextContainer}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Image
                    style={{
                      width: wp('7%'),
                      maxHeight: hp('5%'),
                      marginRight: wp('1%')
                    }}
                    resizeMode='contain'
                    source={NDAU_GREEN}
                  />
                  <Text style={cssStyles.dashboardTextVeryLarge}>
                    {totalNdau}
                  </Text>
                </View>
              </View>
            </Padding>

            <Padding top={0.5} bottom={0.5}>
              <View style={cssStyles.dashboardSmallTextContainer}>
                <Text style={cssStyles.dashboardTextSmallGreen}>
                  {currentPrice}
                  <Text style={cssStyles.asterisks}>*</Text>
                  <Text style={cssStyles.dashboardTextSmallWhiteEnd}>
                    {' '}
                    at current price
                  </Text>
                </Text>

                <Padding top={0.5}>
                  <View style={cssStyles.dashboardSmallTextContainer}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Text style={cssStyles.dashboardTextSmallGreen}>
                        {numberOfAccounts} account
                        {numberOfAccounts !== 1 && 's'}
                      </Text>
                      <TouchableOpacity
                        style={{ marginLeft: wp('1.5%') }}
                        onPress={this.launchAddNewAccountDialog}
                      >
                        <FontAwesome
                          name='plus-circle'
                          color={styleConstants.ICON_GRAY}
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Padding>
              </View>
            </Padding>

            {Object.keys(accounts)
              .sort((a, b) => {
                if (
                  !accounts[a].addressData.nickname ||
                  !accounts[b].addressData.nickname
                ) {
                  return 0
                }

                const accountNumberA = parseInt(
                  accounts[a].addressData.nickname.split(' ')[1]
                )
                const accountNumberB = parseInt(
                  accounts[b].addressData.nickname.split(' ')[1]
                )
                if (accountNumberA < accountNumberB) {
                  return -1
                } else if (accountNumberA > accountNumberB) {
                  return 1
                }
                return 0
              })
              .map((accountKey, index) => {
                const account = accounts[accountKey]
                const eaiPercentage = NdauNodeAPIHelper.eaiPercentage(
                  account.addressData
                )
                const sendingEAITo = NdauNodeAPIHelper.sendingEAITo(
                  account.addressData
                )
                const receivingEAIFrom = NdauNodeAPIHelper.receivingEAIFrom(
                  account.addressData
                )
                const accountLockedUntil = NdauNodeAPIHelper.accountLockedUntil(
                  account.addressData
                )
                const accountNoticePeriod = NdauNodeAPIHelper.accountNoticePeriod(
                  account.addressData
                )
                const accountNotLocked = NdauNodeAPIHelper.accountNotLocked(
                  account.addressData
                )
                const nickname = NdauNodeAPIHelper.accountNickname(
                  account.addressData
                )
                const accountBalance = NdauNodeAPIHelper.accountNdauAmount(
                  account.addressData
                )

                return (
                  <Padding key={index} top={0.5}>
                    <AccountCard
                      index={index}
                      nickname={nickname}
                      address={account.address}
                      eaiPercentage={eaiPercentage}
                      sendingEAITo={sendingEAITo}
                      receivingEAIFrom={receivingEAIFrom}
                      accountBalance={accountBalance}
                      accountLockedUntil={accountLockedUntil}
                      accountNoticePeriod={accountNoticePeriod}
                      accountNotLocked={accountNotLocked}
                      totalNdau={totalNdau}
                      lock={this.lock}
                      unlock={this.unlock}
                      startTransaction={address => {
                        console.log(
                          'state before transaction started',
                          this.state
                        )
                        this.setState({
                          activeAddress: address,
                          modalId: TRANSACTION_MODAL_ID
                        })
                      }}
                      walletId={account.addressData.walletId}
                      expanded={index === 0}
                    />
                  </Padding>
                )
              })}

            <Padding>
              <View style={cssStyles.dashboardRowContainerCenter}>
                <Text style={cssStyles.asterisks}>*</Text>
                <Text
                  style={[
                    cssStyles.dashboardTextVerySmallWhite,
                    { paddingLeft: wp('1%') }
                  ]}
                >
                  The estimated value of ndau in US dollars can be calculated
                  using the Target Price at which new ndau have most recently
                  been issued. The value shown here is calculated using that
                  method as of the issue price on {DateHelper.getTodaysDate()}.
                  The Axiom Foundation bears no responsibility or liability for
                  the calculation of that estimated value, or for decisions
                  based on that estimated value.
                </Text>
              </View>
            </Padding>
          </ScrollView>
        </View>
      </SafeAreaView>
    )
  }
}

export default Dashboard
