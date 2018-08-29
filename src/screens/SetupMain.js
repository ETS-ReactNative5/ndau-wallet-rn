import React, { Component } from 'react';
import { StyleSheet, View, ScrollView, Text, SafeAreaView, Platform } from 'react-native';
import CommonButton from '../components/CommonButton';
import { connect } from 'react-redux';
import styles from '../css/styles';

class SetupMain extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.props.navigator.setStyle({
      drawUnderTabBar: true,
      tabBarHidden: true
    });
  };

  onPushAnother = async () => {
    this.props.navigator.push({
      label: 'SetupUserId',
      screen: 'ndau.SetupUserId',
      passProps: {
        parentStyles: this.props.parentStyles,
        iconsMap: this.props.iconsMap
      },
      navigatorStyle: {
        drawUnderTabBar: true,
        tabBarHidden: true,
        disabledBackGesture: true
      },
      backButtonHidden: true
    });
  };

  render() {
    console.log(`parentStyles: ${JSON.stringify(this.props)}`);
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <ScrollView style={styles.contentContainer}>
            <View>
              <Text style={styles.wizardText}>
                Welcome to ndau, a cryptocurrency designed to be a buoyant long-term store of value.
                {Platform.OS === 'android' ? '\n' : ''}
              </Text>
            </View>
            <View>
              <Text style={styles.wizardText}>
                Currently, ndau is only available to accredited investors. You will need to have
                made your purchase through our site and have your six-character ID code ready in
                order to access this app before launch.{Platform.OS === 'android' ? '\n' : ''}
              </Text>
            </View>
            <View>
              <Text style={styles.wizardText}>
                To get started securely, we will walk you through creating a new wallet. You will
                create a password to access this wallet, and a 12-word recovery passphrase that can
                be used to restore this wallet should you lose access to it (e.g. if you were to
                lose your mobile device).{Platform.OS === 'android' ? '\n' : ''}
              </Text>
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <CommonButton onPress={this.onPushAnother} title="Create new wallet" />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(SetupMain);
