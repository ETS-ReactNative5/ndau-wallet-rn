import React, { Component } from 'react'
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  View,
  Keyboard
} from 'react-native'
import MultiSafeHelper from '../helpers/MultiSafeHelper'
import UserData from '../model/UserData'
import AppConstants from '../AppConstants'
import WaitingForBlockchainSpinner from '../components/common/WaitingForBlockchainSpinner'
import LogStore from '../stores/LogStore'
import FlashNotification from '../components/common/FlashNotification'
import {
  LoginContainer,
  LabelWithIcon,
  TextInput,
  PasswordLinkText,
  LargeButton,
  LoginImage
} from '../components/common'
import UserStore from '../stores/UserStore'

const ANDROID_SHRINK_SIZE = '13%'
const ANDROID_NORMAL_SIZE = '30%'
const IOS_SHRINK_SIZE = '10%'
const IOS_NORMAL_SIZE = '32%'

class Authentication extends Component {
  constructor (props) {
    super(props)

    this.state = {
      password: '',
      showErrorText: false,
      loginAttempt: 1,
      spinner: false,
      lowerHeightAndroid: ANDROID_NORMAL_SIZE,
      lowerHeightIOS: IOS_NORMAL_SIZE
    }

    this.maxLoginAttempts = 10
    props.navigation.addListener('didBlur', FlashNotification.hideMessage)
  }

  componentWillMount () {
    if (Platform.OS === 'ios') {
      this.keyboardWillShowSub = Keyboard.addListener(
        'keyboardWillShow',
        this.keyboardWillShow
      )
      this.keyboardWillHideSub = Keyboard.addListener(
        'keyboardWillHide',
        this.keyboardWillHide
      )
    } else {
      this.keyboardDidShowSub = Keyboard.addListener(
        'keyboardDidShow',
        this.keyboardWillShow
      )
      this.keyboardDidHideSub = Keyboard.addListener(
        'keyboardDidHide',
        this.keyboardWillHide
      )
    }
  }

  componentWillUnmount () {
    if (Platform.OS === 'ios') {
      this.keyboardWillShowSub.remove()
      this.keyboardWillHideSub.remove()
    } else {
      this.keyboardDidShowSub.remove()
      this.keyboardDidHideSub.remove()
    }
  }

  login = async () => {
    this.setState({ spinner: true }, async () => {
      try {
        let user = await MultiSafeHelper.getDefaultUser(this.state.password)
        console.log(user)
        if (user) {
          FlashNotification.hideMessage()
          UserStore.setUser(user)

          LogStore.log(
            `User in Authentication found is ${JSON.stringify(user)}`
          )

          // cache the password
          UserStore.setPassword(this.state.password)
          let errorMessage = null

          try {
            await UserData.loadUserData(user)
          } catch (error) {
            FlashNotification.showError(error.message)
            LogStore.log(error)
            errorMessage = error.message
          }

          this.setState({ spinner: false }, () => {
            this.props.navigation.navigate('Dashboard', {
              error: errorMessage
            })
          })
        } else {
          this.showLoginError()
          this.setState({ spinner: false })
        }
      } catch (error) {
        LogStore.log(error)
        this.showLoginError()
        this.setState({ spinner: false })
      }
    })
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
    this.props.navigation.navigate('SetupWelcome')
  }

  showPasswordReset = user => {
    FlashNotification.hideMessage()
    this.props.navigation.navigate('SetupGetRecoveryPhrase', {
      user: user,
      mode: AppConstants.PASSWORD_RESET_MODE
    })
  }

  dropDownSelected = (index, value) => {
    this.setState({
      userId: value
    })
  }

  _getDuration = event => {
    if (event) {
      this.eventDuration = event.duration
    }
    return event ? event.duration : this.eventDuration
  }

  keyboardWillShow = event => {
    this.setState({
      lowerHeightAndroid: ANDROID_SHRINK_SIZE,
      lowerHeightIOS: IOS_SHRINK_SIZE
    })
  }

  keyboardWillHide = event => {
    this.setState({
      lowerHeightAndroid: ANDROID_NORMAL_SIZE,
      lowerHeightIOS: IOS_NORMAL_SIZE
    })
  }

  render () {
    const { textInputColor } = this.state
    return (
      <LoginContainer>
        <KeyboardAvoidingView
          keyboardVerticalOffset={Platform.OS === 'ios' ? 300 : -130}
          behavior={Platform.OS === 'ios' ? 'height' : 'position'}
        >
          <WaitingForBlockchainSpinner spinner={this.state.spinner} />
          <View
            style={{
              ...Platform.select({
                ios: {
                  height: 'auto'
                },
                android: {
                  height: '42%'
                }
              })
            }}
          >
            <LoginImage />
          </View>
          <View style={{ minHeight: '30%' }}>
            <LabelWithIcon
              onPress={this.showInformation}
              fontAwesomeIconName='info-circle'
            >
              Password
            </LabelWithIcon>
            <TextInput
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
              placeholder='Enter your password...'
              secureTextEntry
              autoCapitalize='none'
              onSubmitEditing={this.login}
            />
            <PasswordLinkText onPress={this.showPasswordReset}>
              Forgot your password?
            </PasswordLinkText>
          </View>

          <View
            style={{
              ...Platform.select({
                ios: {
                  height: this.state.lowerHeightIOS
                },
                android: {
                  height: this.state.lowerHeightAndroid
                }
              }),
              flexDirection: 'column',
              justifyContent: 'flex-end'
            }}
          >
            <LargeButton sideMargins onPress={this.login}>
              Login
            </LargeButton>
          </View>
        </KeyboardAvoidingView>
      </LoginContainer>
    )
  }
}

export default Authentication
