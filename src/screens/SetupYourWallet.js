import React, { Component } from 'react'

import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableWithoutFeedback
} from 'react-native'
import CommonButton from '../components/CommonButton'
import SetupProgressBar from '../components/SetupProgressBar'
import cssStyles from '../css/styles'
import { SafeAreaView } from 'react-navigation'
import EntropyHelper from '../helpers/EntropyHelper'
import LoggingService from '../services/LoggingService'
import { SetupContainer, ParagraphText } from '../components/setup'
import { ProgressBar, LargeButtons } from '../components/common'

class SetupYourWallet extends Component {
  showNextSetup = async () => {
    const user = this.props.navigation.getParam('user', {})

    await EntropyHelper.generateEntropy()
    this.props.navigation.navigate('SetupRecoveryPhrase', {
      walletSetupType:
        this.props.navigation.state.params &&
        this.props.navigation.state.params.walletSetupType,
      user
    })
  }

  render () {
    return (
      <SetupContainer {...this.props} pageNumber={2}>
        <ParagraphText>
          Next we will give you a recovery phrase. This is critical to restoring
          your wallet. You risk losing access to your funds if you do not WRITE
          IT DOWN and store it in a secure location. Do not save this phrase on
          your device or in the cloud. Do not do this step in a public place
          where someone looking over your shoulder could see this phrase.
        </ParagraphText>
        <LargeButtons bottom onPress={() => this.showNextSetup()}>
          Get my recovery phrase
        </LargeButtons>
      </SetupContainer>
    )
  }
}

export default SetupYourWallet
