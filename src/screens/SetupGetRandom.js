import React, { Component } from 'react';
import { StyleSheet, View, Text, SafeAreaView, ScrollView } from 'react-native';
import Base64 from 'base-64';
import CommonButton from '../components/CommonButton.js';
import Randal from '../helpers/randal.js';
import Stepper from '../components/Stepper';

class SetupGetRandom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      entropy: 'ZWEQAwQFBgcICQoLDA0ODw==',
      percentage: 0,
      doneDisabled: true,
      scribbling: false
    };

    this.randalPromise = this.initRandal().catch((e) => {
      console.error(e);
    });
  }

  initRandal() {
    this.randal = new Randal();
    return this.randal.init().then(() => {
      this.randal.onUpdate(() => {
        this.setState({
          entropy: Base64.encode(this.randal.getHash().substr(0, 16)),
          percentage: this.randal.getPercentage()
        });
      });

      this.randal.onDone(() => {
        this.setState({ doneDisabled: false });
      });
    });
  }

  onPushAnother = async () => {
    this.props.navigator.push({
      label: 'SetupYourWallet',
      screen: 'ndau.SetupYourWallet',
      passProps: {
        encryptionPassword: this.props.encryptionPassword,
        userId: this.props.userId,
        parentStyles: this.props.parentStyles,
        entropy: this.state.entropy,
        iconsMap: this.props.iconsMap,
        numberOfAccounts: this.props.numberOfAccounts
      },
      navigatorStyle: {
        drawUnderTabBar: true,
        tabBarHidden: true,
        disabledBackGesture: true
      },
      backButtonHidden: true
    });
  };

  handleScribble(evt) {
    this.onScribbleStart();
    this.randal.checkPoint(evt.nativeEvent.locationX, evt.nativeEvent.locationY);
  }
  onScribbleStart() {
    if (this.state.scribbling) {
      return;
    }
    this.setState({ scribbling: true });
  }
  onScribbleEnd() {
    if (!this.state.scribbling) {
      return;
    }
    this.setState({ scribbling: false });
  }

  onScribbleStart() {
    if (this.state.scribbling == true) {
      return;
    }
    this.setState({ scribbling: true });
  }
  onScribbleEnd() {
    if (this.state.scribbling == false) {
      return;
    }
    this.setState({ scribbling: false });
  }

  render() {
    const { scribbling } = this.state;
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={this.props.parentStyles.container}>
          <ScrollView style={styles.contentContainer} scrollEnabled={!scribbling}>
            <Stepper screenNumber={3} />

            <View>
              <Text style={this.props.parentStyles.wizardText}>
                To generate the strongest possible encryption, we need a source of random input.
                Scribble in the box below to add randomness to your key.
              </Text>
            </View>
            <View style={{ marginTop: 8 }}>
              <ProgBar percentage={this.state.percentage} />
              <View
                onStartShouldSetResponderCapture={() => true}
                onResponderMove={(evt) => this.handleScribble(evt)}
                style={styles.scribbleArea}
                onResponderRelease={() => this.onScribbleEnd()}
                onResponderTerminate={() => this.onScribbleEnd()}
              />
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <CommonButton
              onPress={this.onPushAnother}
              title="Done"
              disabled={this.state.doneDisabled}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

function ProgBar(props) {
  let percentage = Math.min(props.percentage, 100);
  return (
    <View
      style={{
        height: 20,
        flex: 1,
        backgroundColor: 'grey',
        marginBottom: 20,
        marginTop: 10
      }}
    >
      <View
        style={{
          height: 20,
          backgroundColor: percentage == 100 ? '#4e957a' : '#f99d1c',
          width: String(percentage) + '%'
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#1c2227'
  },
  contentContainer: {
    flex: 1 // pushes the footer to the end of the screen
  },
  footer: {
    justifyContent: 'flex-end'
  },
  progress: {
    paddingTop: 30,
    paddingBottom: 30
  },
  scribbleArea: {
    backgroundColor: 'white',
    flex: 1,
    height: 200
  }
});

export default SetupGetRandom;
