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
import SetupGetRecoveryPhrase from './SetupGetRecoveryPhrase'

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
      if (user) {
        console.log(`user in Passphrase found is ${JSON.stringify(user, null, 2)}`)

        await UserData.loadData(user)

        this.props.navigation.navigate('Dashboard', {
          user,
          encryptionPassword: this.state.password
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
    Alert.alert(
      'Error',
      `Login attempt ${this.state.loginAttempt} of ${this.maxLoginAttempts} failed.`,
      [
        {
          text: 'OK',
          onPress: () => {
            this.setState({ loginAttempt: this.state.loginAttempt + 1 })
          }
        }
      ],
      { cancelable: false }
    )
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
    this.props.navigation.navigate('SetupWelcome')
  }

  showRecovery = user => {
    this.props.navigation.navigate('SetupGetRecoveryPhrase', {
      user: user,
      encryptionPassword: this.state.password,
      mode: SetupGetRecoveryPhrase.PASSWORD_RESET_MODE
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
              <Image style={styles.image} source={require('img/n_icon_ko.png')} />
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
              <Text onPress={this.showRecovery} style={cssStyles.linkText}>
                Forgot your password?
              </Text>
            </View>
            <View style={styles.imageView}>
              <TouchableOpacity onPress={this.showInformation}>
                <Image
                  style={{ width: 35, height: 38 }}
                  source={require('img/info_icon_gold.png')}
                />
              </TouchableOpacity>
            </View>
            {this.state.showErrorText
              ? <View style={styles.errorContainer}>
                <Text style={cssStyles.errorText}>
                    Please enter the passphrase you chose to decrypt this app.{' '}
                </Text>
              </View>
              : null}
          </ScrollView>
          <View style={styles.footer}>
            <View style={styles.centerTextView}>
              <Text onPress={this.showSetup} style={cssStyles.linkText}>
                Add wallet
              </Text>
            </View>
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
    tintColor: '#4e957a',
    ...Platform.select({
      ios: {
        marginTop: hp('3%')
      },
      android: {
        marginTop: hp('2%')
      }
    })
  },
  infoIcon: {
    marginLeft: 12,
    marginTop: 20
  }
})

export default Passphrase
