import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  SafeAreaView,
  NativeModules,
  Alert
} from 'react-native';
import groupIntoRows from '../helpers/groupIntoRows';
import CommonButton from '../components/CommonButton';
import Stepper from '../components/Stepper';
import RNExitApp from 'react-native-exit-app';
import cssStyles from '../css/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  pushSetup,
  setSeedPhrase,
  setShuffledWords,
  setShuffledMap
} from '../actions/NavigationActions';

var _ = require('lodash');

const ROW_LENGTH = 3; // 3 items per row

class SetupSeedPhrase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      seedPhrase: []
    };

    this.props.navigator.toggleNavBar({
      to: 'hidden',
      animated: false
    });
  }

  componentDidMount = () => {
    this.generateSeedPhrase();
  };

  showExitApp() {
    Alert.alert(
      '',
      `Problem occurred validating the phrase, please contact Oneiro.`,
      [
        {
          text: 'Exit app',
          onPress: () => {
            RNExitApp.exitApp();
          }
        }
      ],
      { cancelable: false }
    );
  }

  generateSeedPhrase = async () => {
    console.debug(`entropy in generateSeedPhrase is ${this.props.reduxProps.entropy}`);
    const KeyaddrManager = NativeModules.KeyaddrManager;
    const seeds = await KeyaddrManager.KeyaddrWordsFromBytes('en', this.props.reduxProps.entropy);
    const seedBytes = await KeyaddrManager.KeyaddrWordsToBytes('en', seeds);
    if (!_(seedBytes).isEqual(this.props.reduxProps.entropy)) {
      this.showExitApp();
    } else {
      console.debug(`${seedBytes} and ${this.props.reduxProps.entropy} are equal.`);
    }
    console.debug(`keyaddr's seed words are: ${seeds}`);
    const seedPhrase = seeds.split(/\s+/g);
    this.setState({ seedPhrase: seedPhrase });

    // Shuffle the deck with a Fisher-Yates shuffle algorithm;
    // walks through the array backwards once, exchanging each value
    // with a random element from the remainder of the array
    let map = seedPhrase.map((e, i) => i);
    let arr = seedPhrase.slice();
    for (let i = arr.length - 1; i >= 0; i--) {
      let r = Math.floor(Math.random() * i);
      [ map[i], map[r] ] = [ map[r], map[i] ];
      [ arr[i], arr[r] ] = [ arr[r], arr[i] ];
    }
    this.shuffledWords = arr;
    // turn array inside out
    this.shuffleMap = map.reduce((a, c, i) => {
      a[c] = i;
      return a;
    }, []);
  };

  showNextSetup = () => {
    this.props.setSeedPhrase(this.state.seedPhrase);
    this.props.setShuffledMap(this.shuffleMap);
    this.props.setShuffledWords(this.shuffledWords);
    this.props.pushSetup('ndau.SetupConfirmSeedPhrase', this.props.navigator);
  };

  render() {
    // chop the words into ROW_LENGTH-tuples
    const words = groupIntoRows(this.state.seedPhrase, ROW_LENGTH);

    let count = 1;
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={cssStyles.container}>
          <ScrollView style={styles.contentContainer}>
            <Stepper screenNumber={5} />
            <View style={{ marginBottom: 10 }}>
              <Text style={cssStyles.wizardText}>
                Write this phrase down. You will want to store it in a secure location.
              </Text>
            </View>
            {words.map((row, rowIndex) => {
              return (
                <View key={rowIndex} style={styles.rowView}>
                  {row.map((item, index) => {
                    return (
                      <View key={index} style={styles.rowTextView}>
                        <Text
                          style={{
                            color: '#ffffff',
                            fontSize: 20,
                            fontFamily: 'TitilliumWeb-Regular',
                            textAlign: 'center'
                          }}
                        >
                          {count++}.{'\n'}
                          {item}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.footer}>
            <CommonButton onPress={this.showNextSetup} title="I wrote it down" />
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
  rowView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  rowTextView: {
    height: 80,
    width: 100,
    marginBottom: 10,
    marginTop: 10
  }
});

const mapStateToProps = (state, ownProps) => {
  console.log(`mapStateToProps getting called with ${JSON.stringify(state)}`);
  return { entropy: state.entropy };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    { pushSetup, setSeedPhrase, setShuffledWords, setShuffledMap },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(SetupSeedPhrase);
