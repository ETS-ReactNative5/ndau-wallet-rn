import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, TextInput, Alert } from 'react-native';
import CommonButton from '../components/CommonButton';
import SetupProgressBar from '../components/SetupProgressBar';
import cssStyles from '../css/styles';
import SetupStore from '../model/SetupStore';
import { SafeAreaView } from 'react-navigation';

class SetupEncryptionPassword extends Component {
  constructor(props) {
    super(props);
  }

  showNextSetup = () => {
    const user = this.props.navigation.getParam('user', null);
    if (user) {
      if (!user.userId) {
        user.userId = SetupStore.walletName;
      }
      if (!user.wallets) {
        user.wallets = [ { walletName: SetupStore.walletName } ];
      }
    }
    this.props.navigation.navigate('SetupEncryptionPassword', {
      comingFrom: 'SetupWalletName',
      user
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={cssStyles.container}>
          <ScrollView style={styles.contentContainer}>
            <SetupProgressBar screenNumber={4} />
            <View style={styles.textContainer}>
              <Text style={cssStyles.wizardText} onPress={this.showInformation}>
                Give this wallet a name.
              </Text>
            </View>
            <TextInput
              style={cssStyles.textInput}
              onChangeText={(value) => {
                SetupStore.walletName = value;
              }}
              // value={(value) => {
              //   SetupStore.walletName = value;
              // }}
              placeholder="Wallet name"
              placeholderTextColor="#333"
              autoCapitalize="none"
            />
          </ScrollView>
          <View style={styles.footer}>
            <CommonButton onPress={this.showNextSetup} title="Next" />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#1c2227'
  },
  button: {
    marginTop: 0
  },
  textContainer: {
    marginBottom: 8
  },
  contentContainer: {
    flex: 1 // pushes the footer to the end of the screen
  },
  footer: {
    justifyContent: 'flex-end'
  },
  progress: {
    paddingTop: 15,
    paddingBottom: 15
  },
  infoParagraph: {
    flexDirection: 'row'
  }
});

export default SetupEncryptionPassword;
