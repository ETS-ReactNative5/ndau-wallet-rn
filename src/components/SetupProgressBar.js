import React, { Component } from 'react';
import { View } from 'react-native';
import ProgressBar from './ProgressBar';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const NUMBER_OF_SCREENS = 8;

class SetupProgressBar extends Component {
  constructor(props) {
    super(props);

    const { navigation } = props;
    this.walletSetUpType = navigation && navigation.getParam('walletSetUpType', null);
  }

  getProgress = (screenNumber=0) => {
    return (100 / NUMBER_OF_SCREENS) * screenNumber;
  }

  render() {
    if(!this.walletSetUpType || !screenNumber) {
      return (
        <View style={{marginBottom: hp('7%')}}></View>
      );
    }

    const { screenNumber } = this.props;
    const progress = this.getProgress(screenNumber);

    return (
      <View style={{marginBottom: hp('3%')}}>
        <ProgressBar
          progress={progress}
          currentStep={screenNumber}
          numberOfSteps={NUMBER_OF_SCREENS}
          showSteps
        />
      </View>
    );
  }
}

export default SetupProgressBar;
