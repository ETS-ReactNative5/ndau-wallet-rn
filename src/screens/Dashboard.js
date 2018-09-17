import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import { ScrollView, View, Text, StatusBar } from 'react-native';
import CollapsiblePanel from '../components/CollapsiblePanel';
import cssStyles from '../css/styles';
import styles from '../css/styles';
import DateHelper from '../helpers/DateHelper';
import NdauNodeAPIHelper from '../helpers/NdauNodeAPIHelper';

class Dashboard extends Component {
  render() {
    console.log(`rendering Dashboard`);

    const { navigation } = this.props;
    const user = navigation.getParam('user', {});

    console.debug(`user found is ${JSON.stringify(user, null, 2)}`);
    const { addressData, userId } = user;
    console.debug(`addressData: ${addressData}`);
    return addressData ? (
      <SafeAreaView style={cssStyles.safeContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1c2227" />
        <View style={cssStyles.dashboardTextContainer}>
          <Text style={cssStyles.dashboardTextLarge}>Wallet {userId}</Text>
        </View>
        <View style={cssStyles.dashboardTextContainer}>
          <Text style={cssStyles.dashboardTextVeryLarge}>501,026 NDU</Text>
        </View>
        <View style={cssStyles.dashboardOuterRowContainer}>
          <View style={cssStyles.dashboardRowContainer}>
            <Text style={cssStyles.dashboardTextSmallGreen}>8,267,316.00</Text>
            <Text style={cssStyles.dashboardTextSmallWhiteMiddle}>
              USD<Text style={styles.asterisks}>**</Text>
            </Text>
            <Text style={cssStyles.dashboardTextSmallWhiteEnd}>at current price</Text>
          </View>
          <View style={cssStyles.dashboardRowContainer}>
            <Text style={cssStyles.dashboardTextSmallGreen}>644,591.00</Text>
            <Text style={cssStyles.dashboardTextSmallWhiteMiddle}>
              USD<Text style={styles.asterisks}>**</Text>
            </Text>
            <Text style={cssStyles.dashboardTextSmallWhiteEnd}>your cost basis</Text>
          </View>
        </View>
        <ScrollView style={cssStyles.container}>
          {addressData ? (
            addressData.map((account, index) => {
              const counter = index + 1;
              return (
                <CollapsiblePanel
                  key={index}
                  index={index}
                  title={`Address ${counter}`}
                  account={account}
                >
                  {NdauNodeAPIHelper.accountLockedUntil(account) ? (
                    <Text style={cssStyles.text}>
                      Account will be unlocked {NdauNodeAPIHelper.accountLockedUntil(account)}
                    </Text>
                  ) : null}
                  <Text style={cssStyles.text}>Some dates here</Text>
                  <Text style={cssStyles.text}>Where sending from</Text>
                </CollapsiblePanel>
              );
            })
          ) : null}
          <View style={cssStyles.dashboardRowContainerCenter}>
            <Text style={styles.asterisks}>**</Text>
            <Text style={cssStyles.dashboardTextVerySmallWhite}>
              The estimated value of ndau in US dollars can be calculated using the Target Price at
              which new ndau have most recently been issued. The value shown here is calculated
              using that method as of the issue price on {DateHelper.getTodaysDate()}. The Axiom
              Foundation bears no responsibility or liability for the calculation of that estimated
              value, or for decisions based on that estimated value.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    ) : (
      <SafeAreaView style={cssStyles.safeContainer} />
    );
  }
}

export default Dashboard;
