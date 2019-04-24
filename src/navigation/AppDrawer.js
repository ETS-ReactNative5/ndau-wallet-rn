import React from 'react'
import { Alert, ScrollView, Platform, Linking } from 'react-native'
import VersionNumber from 'react-native-version-number'
import DeviceInfo from 'react-native-device-info'
import {
  DrawerEntryItem,
  DrawerExit,
  DrawerContainer
} from '../components/drawer'
import LoggingService from '../services/LoggingService'
import rnfs from 'react-native-fs'

const Mailer = require('NativeModules').RNMail

class AppDrawer extends React.Component {
  constructor (props) {
    super(props)
  }

  closeDrawer = () => {
    this.props.navigation.closeDrawer()
  }

  dashboard = () => {
    this.closeDrawer()
    this.props.navigation.navigate('App')
  }

  recoverWallet = async () => {
    this.closeDrawer()
    this.props.navigation.navigate('SetupGetRecoveryPhrase')
  }

  addWallet = async () => {
    this.closeDrawer()
    this.props.navigation.navigate('SetupYourWallet')
  }

  sendSupportEmail = async () => {
    this.closeDrawer()
    const data = await LoggingService.getLoggingData()
    var path = rnfs.DocumentDirectoryPath + '/ndau-wallet.log'

    // write the file and wait
    try {
      await rnfs.writeFile(path, data, 'utf8')
    } catch (error) {
      LoggingService.error(error)
    }

    Mailer.mail(
      {
        subject: `Wallet App Support - ${this.getVersion()} - ${this.getOs()} - ${this.getHardware()}`,
        recipients: ['support@oneiro.freshdesk.com'],
        body: '/n/n' + data,
        attachment: {
          path, // The absolute path of the file from which to read data.
          mimeType: 'log',
          name: 'ndau-wallet.log'
        }
      },
      error => {
        if (error) {
          LoggingService.error(error)
        }
      }
    )
  }

  getHardware () {
    return DeviceInfo.getManufacturer() + ' ' + DeviceInfo.getModel()
  }

  getVersion () {
    let version = `V${VersionNumber.appVersion}`
    if (Platform.OS === 'ios') {
      version += `.${VersionNumber.buildVersion}`
    }
    return version
  }

  getOs () {
    return DeviceInfo.getManufacturer() + ' ' + DeviceInfo.getSystemName()
  }

  logout = () => {
    this.closeDrawer()
    Alert.alert(
      'Logout Confirmation',
      'Are you sure you want to log out of ndau wallet?',
      [
        {
          text: 'Cancel',
          onPress: () => {},
          style: 'cancel'
        },
        {
          text: 'OK',
          onPress: () => {
            this.props.navigation.navigate('Authentication')
          }
        }
      ],
      { cancelable: false }
    )
  }

  logging = () => {
    this.closeDrawer()
    this.props.navigation.navigate('Logging')
  }

  render () {
    return (
      <DrawerContainer logoutHandler={() => this.logout()}>
        <ScrollView>
          <DrawerExit onPress={() => this.closeDrawer()} />
          <DrawerEntryItem
            onPress={() => this.dashboard()}
            fontAwesomeIconName='home'
          >
            Dashboard
          </DrawerEntryItem>

          <DrawerEntryItem
            onPress={() => this.addWallet()}
            fontAwesomeIconName='plus-square'
          >
            Add wallet
          </DrawerEntryItem>

          <DrawerEntryItem
            onPress={() => this.recoverWallet()}
            fontAwesomeIconName='clock'
          >
            Recover wallet
          </DrawerEntryItem>

          <DrawerEntryItem
            onPress={() => this.sendSupportEmail()}
            fontAwesomeIconName='comment'
          >
            Contact support
          </DrawerEntryItem>

          <DrawerEntryItem>{this.getVersion()}</DrawerEntryItem>

          <DrawerEntryItem
            onPress={() => this.logging()}
            fontAwesomeIconName='exclamation-triangle'
          >
            Logging
          </DrawerEntryItem>
        </ScrollView>
      </DrawerContainer>
    )
  }
}

export default AppDrawer
