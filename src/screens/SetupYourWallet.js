import React, { Component } from 'react'

import EntropyHelper from '../helpers/EntropyHelper'
import { SetupContainer } from '../components/setup'
import { LargeButtons, ParagraphText } from '../components/common'

class SetupYourWallet extends Component {
  showNextSetup = async () => {
    await EntropyHelper.generateEntropy()
    this.props.navigation.navigate('SetupRecoveryPhrase')
  }

  componentWillMount = () => {
    this.fromHamburger = this.props.navigation.getParam('fromHamburger', null)
  }

  goBack = () => {
    this.props.navigation.navigate('Dashboard')
  }

  render () {
    return (
      <SetupContainer
        {...this.props}
        goBack={this.fromHamburger ? this.goBack : null}
        pageNumber={2}
      >
        <ParagraphText>
          Next we will give you a recovery phrase. This is critical to restoring
          your wallet. You risk losing access to your funds if you do not WRITE
          IT DOWN and store it in a secure location. Do not save this phrase on
          your device or in the cloud. Do not do this step in a public place
          where someone looking over your shoulder could see this phrase.
        </ParagraphText>
        <LargeButtons sideMargins bottom onPress={() => this.showNextSetup()}>
          Get my recovery phrase
        </LargeButtons>
      </SetupContainer>
    )
  }
}

export default SetupYourWallet
