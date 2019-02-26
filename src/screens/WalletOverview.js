import React, { Component } from 'react'
import { SafeAreaView } from 'react-navigation'
import {
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  RefreshControl,
  TouchableOpacity,
  AppState,
  Platform
} from 'react-native'
import cssStyles from '../css/styles'
import DateHelper from '../helpers/DateHelper'
import AccountAPIHelper from '../helpers/AccountAPIHelper'
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
import KeyMaster from '../helpers/KeyMaster'
import MultiSafeHelper from '../helpers/MultiSafeHelper'
import UserData from '../model/UserData'
import FlashNotification from '../components/FlashNotification'
import Padding from '../components/Padding'
import OrderAPI from '../api/OrderAPI'
import DataFormatHelper from '../helpers/DataFormatHelper'
import AsyncStorageHelper from '../model/AsyncStorageHelper'
import CommonButton from '../components/CommonButton'
import WaitingForBlockchainSpinner from '../components/WaitingForBlockchainSpinner'
import LoggingService from '../services/LoggingService'
import CollapsiblePanel from '../components/CollapsiblePanel'
import { AppContainer, NdauTotal, Label } from '../components/common'
import { AccountButton, AccountPanel } from '../components/account'
import {
  DashboardContainer,
  DashboardLabel,
  DashboardPanel,
  DashboardLabelWithIcon
} from '../components/dashboard'
import { DrawerHeaderForOverview, DrawerHeader } from '../components/drawer'
import componentStyles from '../css/componentStyles'

const NDAU_GREEN = require('img/ndau-icon-green.png')

class WalletOverview extends Component {
  constructor (props) {
    super(props)

    this.state = {
      number: 1,
      activeAddress: null,
      wallet: {},
      refreshing: false,
      marketPrice: 0,
      spinner: false,
      appState: AppState.currentState,
      queue: null
    }

    this.isTestNet = false
  }

  componentWillUnmount () {
    AppState.removeEventListener('change', this._handleAppStateChange)
  }

  _handleAppStateChange = async nextAppState => {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      this._onRefresh()
    }
    this.setState({ appState: nextAppState })
  }

  // componentWillMount = async () => {
  // const user = this.props.navigation.getParam('user', {})
  // const marketPrice = this.props.navigation.getParam('marketPrice', 0)
  // this.setState({ user, marketPrice })
  // this.isTestNet = await AsyncStorageHelper.isTestNet()
  // }

  componentWillMount = async () => {
    AppState.addEventListener('change', this._handleAppStateChange)

    const wallet = this.props.navigation.getParam('wallet', null)
    this.setState({ wallet })

    const error = this.props.navigation.getParam('error', null)
    if (error) {
      FlashNotification.showError(error, false, true)
    }
  }

  subtractNumber = () => {
    if (this.state.number > 1) {
      this.setState({ number: (this.state.number -= 1) })
    }
  }

  addNumber = () => {
    this.setState({ number: (this.state.number += 1) })
  }

  unlock = (wallet, account) => {
    this._unlockModalDialog.setWallet(wallet)
    this._unlockModalDialog.setAccount(account)
    this._unlockModalDialog.showModal()
  }

  lock = (wallet, account) => {
    this._lockModalDialog.setWallet(wallet)
    this._lockModalDialog.setAccount(account)
    this._lockModalDialog.showModal()
  }

  stopSpinner = () => {
    this.setState({ spinner: false })
  }

  startSpinner = () => {
    this.setState({ spinner: true })
  }

  buy = () => {
    // TODO: if no code exists we have to verify identity
    this.props.navigation.navigate('IdentityVerificationIntro')
    // TODO: otherwise we can continue in the purchase of ndau
  }

  launchAddNewAccountDialog = () => {
    this._newAccountModal.showModal()
  }

  addNewAccount = async () => {
    try {
      const user = await KeyMaster.createNewAccount(
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
    FlashNotification.hideMessage()
    // this.setState({ refreshing: true })

    // TODO: need to implement
    // const user = this.state.user
    // let marketPrice = this.state.marketPrice
    // try {
    //   await UserData.loadData(user)
    //   marketPrice = await OrderAPI.getMarketPrice()
    // } catch (error) {
    //   FlashNotification.showError(error.message, false, false)
    // }

    // this.setState({ refreshing: false })
  }

  _showAccountDetails = account => {
    this.props.navigation.navigate('AccountDetails', { account })
  }

  render = () => {
    try {
      const { wallet } = this.state
      const totalNdau = wallet
        ? AccountAPIHelper.accountTotalNdauAmount(wallet.accounts)
        : 0
      const currentPrice = AccountAPIHelper.currentPrice(
        this.state.marketPrice,
        totalNdau
      )

      return (
        <AppContainer>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this._onRefresh}
              />
            }
          >
            <DrawerHeaderForOverview {...this.props}>
              Wallet name
            </DrawerHeaderForOverview>
            <NdauTotal>{totalNdau}</NdauTotal>
            <DashboardContainer>
              <CollapsiblePanel
                title={currentPrice}
                titleRight='* at current price'
              >
                <Text style={componentStyles.dashboardTextVerySmallWhite}>
                  * The estimated value of ndau in US dollars can be calculated
                  using the Target Price at which new ndau have most recently
                  been issued. The value shown here is calculated using that
                  method as of the issue price on {DateHelper.getTodaysDate()}.
                  The Axiom Foundation, creator and issuer of ndau, bears no
                  responsibility or liability for the calculation of that
                  estimated value, or for decisions based on that estimated
                  value.
                </Text>
              </CollapsiblePanel>
              <DashboardLabelWithIcon
                onPress={() => this.addNewAccount()}
                fontAwesomeIconName='plus-circle'
              >
                Add an account
              </DashboardLabelWithIcon>
              {wallet
                ? Object.keys(wallet.accounts)
                  .sort((a, b) => {
                    if (
                      !wallet.accounts[a].addressData.nickname ||
                        !wallet.accounts[b].addressData.nickname
                    ) {
                      return 0
                    }

                    const accountNumberA = parseInt(
                      wallet.accounts[a].addressData.nickname.split(' ')[1]
                    )
                    const accountNumberB = parseInt(
                      wallet.accounts[b].addressData.nickname.split(' ')[1]
                    )
                    if (accountNumberA < accountNumberB) {
                      return -1
                    } else if (accountNumberA > accountNumberB) {
                      return 1
                    }
                    return 0
                  })
                  .map((accountKey, index) => {
                    return (
                      <AccountPanel
                        key={index}
                        onPress={() =>
                          this._showAccountDetails(
                            wallet.accounts[accountKey]
                          )
                        }
                        account={wallet.accounts[accountKey]}
                        {...this.props}
                      >
                        <AccountButton icon='lock-open'>Unlock</AccountButton>
                        <AccountButton icon='arrow-alt-up'>
                            Send
                        </AccountButton>
                        <AccountButton icon='arrow-alt-down'>
                            Receive
                        </AccountButton>
                      </AccountPanel>
                    )
                  })
                : null}
            </DashboardContainer>
          </ScrollView>
        </AppContainer>
        // <SafeAreaView style={cssStyles.safeContainer}>
        //   <DrawerButton
        //     {...this.props}
        //     style={{ position: 'absolute', top: 0, right: 0 }}
        //   />
        //   <UnlockModalDialog
        //     ref={component => (this._unlockModalDialog = component)}
        //     refresh={this._onRefresh}
        //     stopSpinner={this.stopSpinner}
        //     startSpinner={this.startSpinner}
        //   />
        //   <LockModalDialog
        //     ref={component => (this._lockModalDialog = component)}
        //     refresh={this._onRefresh}
        //     stopSpinner={this.stopSpinner}
        //     startSpinner={this.startSpinner}
        //   />
        //   <NewAccountModalDialog
        //     number={this.state.number}
        //     subtractNumber={this.subtractNumber}
        //     addNumber={this.addNumber}
        //     addNewAccount={this.addNewAccount}
        //     ref={component => (this._newAccountModal = component)}
        //   />
        //   <TransactionModalDialog
        //     address={this.state.activeAddress || this.props.activeAddress}
        //     ref={component => (this._transactionModal = component)}
        //   />
        //   <WaitingForBlockchainSpinner spinner={this.state.spinner} />

      //   <StatusBar barStyle='light-content' backgroundColor='#1c2227' />
      //   <View style={cssStyles.container}>
      //     <ScrollView
      //       style={cssStyles.contentContainer}
      //       refreshControl={
      //         <RefreshControl
      //           refreshing={this.state.refreshing}
      //           onRefresh={this._onRefresh}
      //         />
      //       }
      //     >
      //       <View style={cssStyles.dashboardTextContainer}>
      //         {this.isTestNet ? (
      //           <Text
      //             style={[
      //               cssStyles.dashboardTextSmallWhiteEnd,
      //               { color: styleConstants.LINK_ORANGE }
      //             ]}
      //           >
      //             TestNet
      //           </Text>
      //         ) : null}
      //         <Text style={cssStyles.dashboardTextLarge}>Wallets</Text>
      //       </View>

      //       <View style={cssStyles.dashboardTextContainer}>
      //         <View
      //           style={{
      //             flexDirection: 'row',
      //             alignItems: 'center',
      //             justifyContent: 'center'
      //           }}
      //         >
      //           <Image
      //             style={{
      //               width: wp('7%'),
      //               maxHeight: hp('5%'),
      //               marginRight: wp('1%')
      //             }}
      //             resizeMode='contain'
      //             source={NDAU_GREEN}
      //           />
      //           <Text style={cssStyles.dashboardTextVeryLarge}>
      //             {totalNdau}
      //           </Text>
      //         </View>
      //       </View>

      //       <View style={cssStyles.dashboardSmallTextContainer}>
      //         <Text style={cssStyles.dashboardTextSmallGreen}>
      //           {currentPrice}
      //           <Text style={cssStyles.asterisks}>*</Text>
      //           <Text style={cssStyles.dashboardTextSmallWhiteEnd}>
      //             {' '}
      //             at current price
      //           </Text>
      //         </Text>
      //         {/* <CommonButton top={0.8} onPress={this.buy} title={`Buy ndau`} /> */}
      //         <View style={cssStyles.dashboardSmallTextContainer}>
      //           <View
      //             style={{
      //               flexDirection: 'row',
      //               alignItems: 'center',
      //               justifyContent: 'center'
      //             }}
      //           >
      //             <Text style={cssStyles.dashboardTextSmallGreen}>
      //               {numberOfAccounts} account
      //               {numberOfAccounts !== 1 && 's'}
      //             </Text>
      //             <TouchableOpacity
      //               style={{ marginLeft: wp('1.5%') }}
      //               onPress={this.launchAddNewAccountDialog}
      //             >
      //               <FontAwesome5Pro
      //                 name='plus-circle'
      //                 color={styleConstants.ICON_GRAY}
      //                 size={20}
      //                 light
      //               />
      //             </TouchableOpacity>
      //           </View>
      //         </View>
      //       </View>

      //       {Object.keys(accounts)
      //         .sort((a, b) => {
      //           if (
      //             !accounts[a].addressData.nickname ||
      //             !accounts[b].addressData.nickname
      //           ) {
      //             return 0
      //           }

      //           const accountNumberA = parseInt(
      //             accounts[a].addressData.nickname.split(' ')[1]
      //           )
      //           const accountNumberB = parseInt(
      //             accounts[b].addressData.nickname.split(' ')[1]
      //           )
      //           if (accountNumberA < accountNumberB) {
      //             return -1
      //           } else if (accountNumberA > accountNumberB) {
      //             return 1
      //           }
      //           return 0
      //         })
      //         .map((accountKey, index) => {
      //           const account = accounts[accountKey]
      //           const eaiPercentage = AccountAPIHelper.eaiPercentage(
      //             account.addressData
      //           )
      //           const sendingEAITo = AccountAPIHelper.sendingEAITo(
      //             account.addressData
      //           )
      //           const receivingEAIFrom = AccountAPIHelper.receivingEAIFrom(
      //             account.addressData
      //           )
      //           const accountLockedUntil = AccountAPIHelper.accountLockedUntil(
      //             account.addressData
      //           )
      //           const accountNoticePeriod = AccountAPIHelper.accountNoticePeriod(
      //             account.addressData
      //           )
      //           const accountNotLocked = AccountAPIHelper.accountNotLocked(
      //             account.addressData
      //           )
      //           const nickname = AccountAPIHelper.accountNickname(
      //             account.addressData
      //           )
      //           const accountBalance = AccountAPIHelper.accountNdauAmount(
      //             account.addressData
      //           )

      //           return (
      //             <Padding key={index} top={0.5}>
      //               <AccountCard
      //                 index={index}
      //                 nickname={nickname}
      //                 wallet={wallet}
      //                 account={account}
      //                 address={account.address}
      //                 eaiPercentage={eaiPercentage}
      //                 sendingEAITo={sendingEAITo}
      //                 receivingEAIFrom={receivingEAIFrom}
      //                 accountBalance={accountBalance}
      //                 accountLockedUntil={accountLockedUntil}
      //                 accountNoticePeriod={accountNoticePeriod}
      //                 accountNotLocked={accountNotLocked}
      //                 totalNdau={totalNdau}
      //                 lock={this.lock}
      //                 unlock={this.unlock}
      //                 startTransaction={address => {
      //                   this.setState({
      //                     activeAddress: address
      //                   })
      //                   this._transactionModal.showModal()
      //                 }}
      //                 walletId={account.addressData.walletId}
      //                 expanded={index === 0}
      //               />
      //             </Padding>
      //           )
      //         })}

      //       <Padding>
      //         <View style={cssStyles.dashboardRowContainerCenter}>
      //           <Text style={cssStyles.asterisks}>*</Text>
      //           <Text
      //             style={[
      //               cssStyles.dashboardTextVerySmallWhite,
      //               { paddingLeft: wp('1%') }
      //             ]}
      //           >
      //             The estimated value of ndau in US dollars can be calculated
      //             using the Target Price at which new ndau have most recently
      //             been issued. The value shown here is calculated using that
      //             method as of the issue price on {DateHelper.getTodaysDate()}
      //             . The Axiom Foundation, creator and issuer of ndau, bears no
      //             responsibility or liability for the calculation of that
      //             estimated value, or for decisions based on that estimated
      //             value.
      //           </Text>
      //         </View>
      //       </Padding>
      //     </ScrollView>
      //   </View>
      // </SafeAreaView>
      )
    } catch (error) {
      LoggingService.debug(error)
      FlashNotification.showError(error.message, false)
    }

    return (
      <AppContainer>
        <DrawerHeader {...this.props}>Dashboard</DrawerHeader>
      </AppContainer>
    )
  }
}

export default WalletOverview
