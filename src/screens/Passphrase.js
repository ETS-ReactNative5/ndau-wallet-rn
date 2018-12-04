import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  Alert,
  Image,
  TouchableOpacity,
  Text,
  StatusBar,
  Platform
} from 'react-native'
import CommonButton from '../components/CommonButton'
import cssStyles from '../css/styles'
import MultiSafeHelper from '../helpers/MultiSafeHelper'
import RNExitApp from 'react-native-exit-app'
import { SafeAreaView } from 'react-navigation'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import UserData from '../model/UserData'
import AppConstants from '../AppConstants'
import {
  NEW_WALLET_SETUP_TYPE,
  RECOVERY_WALLET_SETUP_TYPE
} from '../components/SetupProgressBar'
import FlashNotification from '../components/FlashNotification'
import OrderNodeAPI from '../api/OrderNodeAPI'
import AsyncStorageHelper from '../model/AsyncStorageHelper'
import styleConstants from '../css/styleConstants'
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro'

class Passphrase extends Component {
  constructor (props) {
    super(props)

    this.state = {
      password: '',
      showErrorText: false,
      loginAttempt: 1
    }

    this.maxLoginAttempts = 10
  }

  login = async () => {
    try {
      let user = await MultiSafeHelper.getDefaultUser(this.state.password)
      let marketPrice = 0
      if (user) {
        console.log(
          `user in Passphrase found is ${JSON.stringify(user, null, 2)}`
        )

        // cache the password
        await AsyncStorageHelper.setApplicationPassword(this.state.password)

        try {
          await UserData.loadData(user)
          marketPrice = await OrderNodeAPI.getMarketPrice()
        } catch (error) {
          FlashNotification.showError(error.message, false, false)
          return
        }

        FlashNotification.hideMessage()
        this.props.navigation.navigate('Dashboard', {
          user,
          encryptionPassword: this.state.password,
          marketPrice
        })
      } else {
        this.showLoginError()
      }
    } catch (error) {
      console.log(error)
      this.showLoginError()
    }
  }

  showExitApp () {
    Alert.alert(
      '',
      `You have hit the maximum amount of login attempts.`,
      [
        {
          text: 'Exit app',
          onPress: () => {
            RNExitApp.exitApp()
          }
        }
      ],
      { cancelable: false }
    )
  }

  showLoginError = () => {
    if (this.state.loginAttempt === this.maxLoginAttempts) {
      this.showExitApp()
    }
    FlashNotification.showError(
      `Login attempt ${this.state.loginAttempt} of ${
        this.maxLoginAttempts
      } failed.`
    )
    this.setState({ loginAttempt: this.state.loginAttempt + 1 })
  }

  showInformation = () => {
    Alert.alert(
      'Information',
      'Please enter the password you chose to encrypt this app. ' +
        'This is not the same thing as your six-character ID or key ' +
        'recovery phrase.',
      [{ text: 'OK', onPress: () => {} }],
      { cancelable: false }
    )
  }

  showSetup = async () => {
    FlashNotification.hideMessage()
    this.props.navigation.navigate('SetupWelcome', {
      walletSetupType: NEW_WALLET_SETUP_TYPE
    })
  }

  showPasswordReset = user => {
    FlashNotification.hideMessage()
    this.props.navigation.navigate('SetupGetRecoveryPhrase', {
      user: user,
      mode: AppConstants.PASSWORD_RESET_MODE,
      walletSetupType: RECOVERY_WALLET_SETUP_TYPE
    })
  }

  dropDownSelected = (index, value) => {
    this.setState({
      userId: value
    })
  }

  render () {
    console.log(`rendering Passphrase`)
    const { textInputColor } = this.state
    return (
      <SafeAreaView style={cssStyles.safeContainer}>
        <StatusBar barStyle='light-content' backgroundColor='#1c2227' />
        <View style={cssStyles.container}>
          <ScrollView style={cssStyles.contentContainer}>
            <View style={styles.imageView}>
              <Image
                style={styles.image}
                source={require('img/ndau_multi_large_1024.png')}
              />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <TextInput
                style={{
                  height: hp('7%'),
                  width: wp('96%'),
                  borderColor: 'gray',
                  borderWidth: 1,
                  borderRadius: 3,
                  marginTop: hp('1%'),
                  paddingLeft: wp('1%'),
                  color: '#000000',
                  backgroundColor: '#ffffff',
                  fontSize: 18,
                  fontFamily: 'TitilliumWeb-Regular'
                }}
                onChangeText={password => this.setState({ password })}
                value={this.state.password}
                placeholder='App Password'
                placeholderTextColor='#333'
                secureTextEntry={!this.state.showPasswords}
                autoCapitalize='none'
              />
            </View>
            <View style={styles.centerTextView}>
              <Text onPress={this.showPasswordReset} style={cssStyles.linkText}>
                Forgot your password?
              </Text>
            </View>
            <View style={styles.imageView}>
              <TouchableOpacity onPress={this.showInformation}>
                <FontAwesome5Pro
                  name='info-circle'
                  color={styleConstants.LINK_ORANGE}
                  size={30}
                  light
                />
              </TouchableOpacity>
            </View>
            {this.state.showErrorText ? (
              <View style={styles.errorContainer}>
                <Text style={cssStyles.errorText}>
                  Please enter the passphrase you chose to decrypt this app.{' '}
                </Text>
              </View>
            ) : null}
          </ScrollView>
          <View style={styles.footer}>
            <View>
              <CommonButton onPress={this.login} title='Login' />
            </View>
          </View>
        </View>
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    marginTop: 0
  },
  textContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: wp('1%')
  },
  footer: {
    justifyContent: 'flex-end'
  },
  imageView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp('4%')
  },
  centerTextView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: hp('4%'),
    paddingTop: hp('3%')
  },
  image: {
    width: wp('100%'),
    ...Platform.select({
      ios: {
        marginTop: hp('5%'),
        height: hp('20%')
      },
      android: {
        marginTop: hp('7%'),
        height: hp('30%')
      }
    })
  },
  infoIcon: {
    marginLeft: 12,
    marginTop: 20
  }
})

export default Passphrase
