import React, { Component } from 'react'
import {
  View,
  ScrollView,
  Text,
  Linking,
  PixelRatio,
  Platform,
  TouchableOpacity
} from 'react-native'
import groupIntoRows from '../helpers/groupIntoRows'
import CommonButton from '../components/CommonButton'
import cssStyles from '../css/styles'
import { SafeAreaView } from 'react-navigation'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import RecoveryDropdown from '../components/RecoveryDropdown'
import { Dialog } from 'react-native-simple-dialogs'
import SetupProgressBar from '../components/SetupProgressBar'
import RecoveryPhaseHelper from '../helpers/RecoveryPhaseHelper'
import MultiSafeHelper from '../helpers/MultiSafeHelper'
import UserData from '../model/UserData'
import AppConstants from '../AppConstants'
import SetupStore from '../model/SetupStore'
import FlashNotification from '../components/FlashNotification'
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro'
import DataFormatHelper from '../helpers/DataFormatHelper'
import AsyncStorageHelper from '../model/AsyncStorageHelper'
import styleConstants from '../css/styleConstants'
import Spinner from 'react-native-loading-spinner-overlay'

const DEFAULT_ROW_LENGTH = 3 // 3 items per row
const _ = require('lodash')

class SetupGetRecoveryPhrase extends Component {
  constructor (props) {
    super(props)
    this.NORMAL_MODE_TEXT =
      `To verify your account please verify your twelve-word recovery` +
      ` phrase below. Start typing in the box below, then pick the correct suggestion.`
    this.PASSWORD_RESET_MODE_TEXT =
      'To reset your password, please verify your ' +
      'twelve-word recovery phrase. Start typing in the box below, then pick the ' +
      'correct suggestion'
    this.GENESIS_MODE_TEXT =
      `We're almost ready to get you on the ndau blockchain, ` +
      'but we need one last thing from you. \n\nPlease verify your twelve word ' +
      'recovery phrase. Start typing in the box below, then pick the correct suggestion'
    this.NOT_ON_BLOCKCHAIN_MESSAGE =
      'We tried to find matching accounts ' +
      'on the blockchain and found none. Please confirm ' +
      'you entered the correct phrase, and try again.'

    this.state = {
      size: { width: wp('100%'), height: hp('50%') },
      dialogVisible: false,
      recoverPhraseFull: false,
      // recoverPhraseFull: true,
      textColor: '#ffffff',
      confirmationError: false,
      acquisitionError: false,
      stepNumber: 0,
      introductionText: this.NORMAL_MODE_TEXT,
      mode: AppConstants.NORMAL_MODE,
      recoveryWord: '',
      recoveryIndex: 0,
      disableArrows: true,
      spinner: false
    }

    this.index = 0

    // TODO: you can uncomment the below if you need to do some testing
    // on a known phrase that works in testnet/devnet
    this.recoveryPhrase = ['', '', '', '', '', '', '', '', '', '', '', '']
    // this.recoveryPhrase = [
    //   'crouch',
    //   'like',
    //   'blue',
    //   'heavy',
    //   'fatal',
    //   'board',
    //   'night',
    //   'protect',
    //   'cushion',
    //   'bag',
    //   'sun',
    //   'grace'
    // ]
    // this.recoveryPhrase = [
    //   'great',
    //   'permit',
    //   'assault',
    //   'grocery',
    //   'creek',
    //   'bright',
    //   'talk',
    //   'chat',
    //   'deal',
    //   'predict',
    //   'smoke',
    //   'shoot'
    // ]

    this.boxWidth = '30%'
    this.boxHeight = '13%'
    this.rowLength = DEFAULT_ROW_LENGTH
    // if someone has cranked up the font use 1 row instead
    console.log(`PixelRatio.getFontScale is ${PixelRatio.getFontScale()}`)
    if (PixelRatio.getFontScale() > 2) {
      this.rowLength = 1
      this.boxWidth = '100%'
      this.boxHeight = '30%'
      console.log(`boxWidth: ${this.boxWidth} and boxHeight: ${this.boxHeight}`)
    }
    this.recoveryDropdownRef = null
  }

  componentWillMount () {
    const mode = this.props.navigation.getParam(
      'mode',
      AppConstants.NORMAL_MODE
    )
    switch (mode) {
      case AppConstants.GENESIS_MODE:
        introductionText = this.GENESIS_MODE_TEXT
        break
      case AppConstants.PASSWORD_RESET_MODE:
        introductionText = this.PASSWORD_RESET_MODE_TEXT
        break
      default:
        introductionText = this.NORMAL_MODE_TEXT
    }

    this.setState({ mode, introductionText })
  }

  addToRecoveryPhrase = value => {
    this.recoveryPhrase[this.state.recoveryIndex] = value
  }

  noRecoveryPhrase = () => {
    this.setState({ dialogVisible: true })
  }

  sendEmail = () => {
    Linking.openURL(
      'mailto:support@oneiro.freshdesk.com?subject=Lost Recovery Phrase'
    )
  }

  _moveToNextWord = () => {
    if (this.state.recoveryIndex <= 11) {
      const newRecoveryIndex = this.state.recoveryIndex + 1
      this.setState(
        {
          recoveryIndex: newRecoveryIndex,
          recoveryWord: this.recoveryPhrase[newRecoveryIndex],
          disableArrows: this.recoveryPhrase[newRecoveryIndex] === ''
        },
        () => {
          this.adjustStepNumber(this.state.recoveryIndex)
        }
      )
      if (this.recoveryDropdownRef) {
        this.recoveryDropdownRef.clearWord()
        this.recoveryDropdownRef.focus()
      }
    }
    FlashNotification.hideMessage()
  }

  _moveBackAWord = () => {
    if (this.state.recoveryIndex > 0) {
      const newRecoveryIndex = this.state.recoveryIndex - 1
      this.setState(
        {
          recoveryIndex: newRecoveryIndex,
          recoveryWord: this.recoveryPhrase[newRecoveryIndex],
          disableArrows: false
        },
        () => {
          this.adjustStepNumber(this.state.recoveryIndex)
        }
      )
      if (this.recoveryDropdownRef) {
        this.recoveryDropdownRef.focus()
      }
    }
    FlashNotification.hideMessage()
  }

  _checkRecoveryPhrase = async () => {
    return await RecoveryPhaseHelper.checkRecoveryPhrase(
      DataFormatHelper.convertRecoveryArrayToString(this.recoveryPhrase),
      this.props.navigation.getParam('user', null)
    )
  }

  setDisableArrows = value => {
    this.setState({ disableArrows: value })
  }

  setAcquisitionError = value => {
    if (value) {
      FlashNotification.showError('Please select a valid word.', true)
      this.setState({ disableArrows: value })
    }
    this.setState({ acquisitionError: value })
  }

  confirm = async () => {
    this.setState({ spinner: true }, async () => {
      try {
        const { navigation } = this.props

        if (this.state.mode === AppConstants.PASSWORD_RESET_MODE) {
          navigation.navigate('SetupEncryptionPassword', {
            user,
            walletSetupType:
              navigation.state.params &&
              navigation.state.params.walletSetupType,
            mode: AppConstants.PASSWORD_RESET_MODE,
            recoveryPhraseString: DataFormatHelper.convertRecoveryArrayToString(
              this.recoveryPhrase
            )
          })
          return
        }

        const user = await this._checkRecoveryPhrase()
        if (user) {
          const encryptionPassword = navigation.getParam(
            'encryptionPassword',
            null
          )
          let marketPrice = 0
          // IF we have a password we are fixing up an account from a 1.6 user here
          // so we fixed it up...now save it...and go back to Dashboard
          if (encryptionPassword) {
            try {
              await UserData.loadData(user)
              marketPrice = await OrderNodeAPI.getMarketPrice()
            } catch (error) {
              FlashNotification.showError(error.message)
            }

            await MultiSafeHelper.saveUser(
              user,
              encryptionPassword,
              DataFormatHelper.convertRecoveryArrayToString(this.recoveryPhrase)
            )

            this.props.navigation.navigate('Dashboard', {
              user,
              encryptionPassword,
              walletSetupType:
                navigation.state.params &&
                navigation.state.params.walletSetupType,
              marketPrice
            })
          } else {
            if (
              await MultiSafeHelper.recoveryPhraseAlreadyExists(
                user.userId,
                this.recoveryPhrase
              )
            ) {
              FlashNotification.showError(
                'This recovery phrase already exists in the wallet.'
              )
              return
            }
            SetupStore.recoveryPhrase = this.recoveryPhrase
            navigation.navigate('SetupWalletName', {
              user,
              walletSetupType:
                navigation.state.params &&
                navigation.state.params.walletSetupType
            })
          }
        } else {
          this.setState({
            textColor: '#f05123',
            confirmationError: true
          })
          FlashNotification.showError(this.NOT_ON_BLOCKCHAIN_MESSAGE, true)
        }
      } catch (error) {
        console.warn(error)
        this.setState({
          textColor: '#f05123',
          confirmationError: true
        })
        FlashNotification.showError(this.NOT_ON_BLOCKCHAIN_MESSAGE, true)
      }
      this.setState({ spinner: false })
    })
  }

  pushBack = () => {
    this.setState({
      recoverPhraseFull: false,
      confirmationError: false,
      textColor: '#ffffff',
      recoveryIndex: 0,
      stepNumber: 0,
      recoveryWord: this.recoveryPhrase[0],
      disableArrows: false
    })
    FlashNotification.hideMessage()
  }

  adjustStepNumber = pageIndex => {
    this.setState({ stepNumber: pageIndex })
    console.log(`pageIndex: ${pageIndex}`)
    if (pageIndex === this.recoveryPhrase.length) {
      this.setState({ recoverPhraseFull: true })
    }
  }

  _renderAcquisition = () => {
    return (
      <SafeAreaView style={cssStyles.safeContainer}>
        <View style={cssStyles.container}>
          <ScrollView
            style={cssStyles.contentContainer}
            keyboardShouldPersistTaps='always'
          >
            <Spinner
              visible={this.state.spinner}
              textContent={'Talking to blockchain...'}
              textStyle={{
                color: '#ffffff',
                fontSize: 20,
                fontFamily: 'TitilliumWeb-Regular'
              }}
              animation='fade'
              overlayColor='rgba(0, 0, 0, 0.7)'
            />
            <SetupProgressBar
              stepNumber={this.state.stepNumber}
              navigation={this.props.navigation}
            />

            <View style={{ marginBottom: wp('4%') }}>
              <Text style={cssStyles.wizardText}>
                {this.state.introductionText}
              </Text>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={cssStyles.wizardText}>
                  {this.state.recoveryIndex + 1}
                </Text>
                <Text style={cssStyles.wizardText}>{' of '}</Text>
                <Text style={cssStyles.wizardText}>
                  {this.recoveryPhrase.length}
                </Text>
              </View>
            </View>
            <View
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}
              >
                <TouchableOpacity
                  style={{
                    marginLeft: wp('5%'),
                    marginTop: hp('.8%'),
                    ...Platform.select({
                      ios: {
                        marginRight: hp('1.6%')
                      },
                      android: {
                        marginRight: hp('3%')
                      }
                    })
                  }}
                  onPress={this._moveBackAWord}
                >
                  <FontAwesome5Pro
                    name='arrow-circle-left'
                    color={styleConstants.ICON_GRAY}
                    size={32}
                    light
                  />
                </TouchableOpacity>
                <RecoveryDropdown
                  addToRecoveryPhrase={this.addToRecoveryPhrase}
                  setAcquisitionError={this.setAcquisitionError}
                  recoveryWord={this.state.recoveryWord}
                  setDisableArrows={this.setDisableArrows}
                  onSubmitEditing={this._moveToNextWord}
                  ref={input => {
                    this.recoveryDropdownRef = input
                  }}
                />
                <TouchableOpacity
                  style={{
                    marginTop: hp('.5%'),
                    marginLeft: wp('3%'),
                    marginRight: wp('5%')
                  }}
                  onPress={this._moveToNextWord}
                  disabled={this.state.disableArrows}
                >
                  <FontAwesome5Pro
                    name='arrow-circle-right'
                    color={styleConstants.ICON_GRAY}
                    size={32}
                    light
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
          <View style={cssStyles.footer}>
            <Text
              onPress={this.noRecoveryPhrase}
              style={[cssStyles.linkText, { textAlign: 'center' }]}
            >
              I don't have my recovery phrase
            </Text>
          </View>
        </View>
        <Dialog
          style={{
            fontSize: 18,
            fontFamily: 'TitilliumWeb-Regular'
          }}
          visible={this.state.dialogVisible}
          // title="Missing Recovery Phrase"
          onTouchOutside={() => this.setState({ dialogVisible: false })}
        >
          <View>
            <Text style={cssStyles.blackDialogText}>
              Your recovery phrase is necessary to prove ownership of your ndau.
              Your wallet cannot be restored without it. If you have lost your
              recovery phrase please contact.{' '}
            </Text>
            <Text onPress={this.sendEmail} style={[cssStyles.blueLinkText]}>
              Oneiro concierge support.
            </Text>
          </View>
        </Dialog>
      </SafeAreaView>
    )
  }

  _renderConfirmation = () => {
    const words = groupIntoRows(this.recoveryPhrase, this.rowLength)
    const styles = {
      rowTextView: {
        height: hp(this.boxHeight),
        width: wp(this.boxWidth)
      },
      textStyle: {
        color: this.state.textColor,
        fontSize: 20,
        fontFamily: 'TitilliumWeb-Regular',
        textAlign: 'center'
      }
    }
    let count = 1

    return (
      <SafeAreaView style={cssStyles.safeContainer}>
        <View style={cssStyles.container}>
          <ScrollView
            style={cssStyles.contentContainer}
            keyboardShouldPersistTaps='always'
          >
            <Spinner
              visible={this.state.spinner}
              textContent={'Talking to blockchain...'}
              textStyle={{
                color: '#ffffff',
                fontSize: 20,
                fontFamily: 'TitilliumWeb-Regular'
              }}
              animation='fade'
              overlayColor='rgba(0, 0, 0, 0.7)'
            />
            <SetupProgressBar
              stepNumber={this.state.stepNumber}
              navigation={this.props.navigation}
            />
            <View style={{ marginBottom: 10 }}>
              <Text style={cssStyles.wizardText}>
                Is this the correct recovery phrase?{' '}
              </Text>
            </View>
            {words.map((row, rowIndex) => {
              return (
                <View key={rowIndex} style={cssStyles.rowView}>
                  {row.map((item, index) => {
                    return (
                      <View key={index} style={styles.rowTextView}>
                        <Text style={styles.textStyle}>
                          {count++}.{'\n'}
                          {item}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              )
            })}
          </ScrollView>
          <View style={cssStyles.footer}>
            <View style={cssStyles.navButtonWrapper}>
              <CommonButton onPress={() => this.pushBack()} title='Back' />
            </View>
            <View style={cssStyles.navButtonWrapper}>
              <CommonButton onPress={() => this.confirm()} title='Confirm' />
            </View>
          </View>
        </View>
      </SafeAreaView>
    )
  }

  render () {
    console.log(`recoverPhrase is now: ${this.recoveryPhrase}`)

    return !this.state.recoverPhraseFull
      ? this._renderAcquisition()
      : this._renderConfirmation()
  }
}

export default SetupGetRecoveryPhrase
