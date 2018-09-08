import React, { Component } from 'react';
import {
  createStackNavigator,
  createDrawerNavigator,
  SafeAreaView,
  StatusBar
} from 'react-navigation';
import { ScrollView, View, Text, BackHandler, Platform } from 'react-native';
import CollapsiblePanel from '../components/CollapsiblePanel';
import AsyncStorageHelper from '../model/AsyncStorageHelper';
import AlertPanel from '../components/AlertPanel';
// import { connect } from 'react-redux';
import cssStyles from '../css/styles';
// import { bindActionCreators } from 'redux';
// import { pushSetup } from '../actions/NavigationActions';
import UserStore from '../model/UserStore';
import DrawerButton from '../components/DrawerButton';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    console.debug(`props in dashboard are ${JSON.stringify(props, null, 2)}`);

    this.state = {};
  }

  static navigatorStyle = {
    topBarElevationShadowEnabled: false,
    disabledBackGesture: true
  };

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  handleBackButton() {
    return true;
  }

  componentWillMount() {
    if (!this.props.user) {
      this.loginOrSetup();
    }
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  loginOrSetup = () => {
    AsyncStorageHelper.getAllKeys()
      .then((userIds) => {
        console.debug(`userIds is ${userIds}`);

        if (userIds.length > 0) {
          this.getPassphrase();
        } else {
          this.showSetup();
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  getPassphrase = () => {
    // this.props.pushSetup('ndau.Passphrase', this.props.navigator);
    this.props.navigation.navigate('Passphrase');
  };

  showSetup = () => {
    // this.props.pushSetup('ndau.SetupMain', this.props.navigator);
    this.props.navigation.navigate('SetupMain');
  };

  render() {
    let user = this.props.user;
    if (Platform.OS === 'ios') {
      user = UserStore.getUser();
    }

    if (user) {
      console.debug(`user found is ${JSON.stringify(user, null, 2)}`);
      const { addresses, userId } = user;
      console.debug(`renders addresses: ${addresses}`);
      return addresses ? (
        <SafeAreaView style={cssStyles.safeContainer}>
          <StatusBar barStyle="light-content" />
          <View style={cssStyles.dashboardTextContainer}>
            <Text style={cssStyles.dashboardTextLarge}>Wallet {userId}</Text>
          </View>
          <AlertPanel alertText="Welcome to the ndau wallet! We are currently verifying your wallet setup. ndau will be
            sent to this app on Genesis Day. Until then, you can continue to view your holdings on
            the online dashboard." />
          <View style={cssStyles.dashboardTextContainer}>
            <Text style={cssStyles.dashboardTextSmall}>{addresses.length} addresses</Text>
          </View>
          <ScrollView style={cssStyles.container}>
            {addresses ? (
              addresses.map((address, index) => {
                const counter = index + 1;
                return (
                  <CollapsiblePanel
                    key={index}
                    index={index}
                    title={`Address ${counter}`}
                    address={address}
                  >
                    <Text style={cssStyles.text}>{address}</Text>
                  </CollapsiblePanel>
                );
              })
            ) : null}
          </ScrollView>
        </SafeAreaView>
      ) : (
        <SafeAreaView style={cssStyles.safeContainer} />
      );
    } else {
      return <SafeAreaView style={cssStyles.safeContainer} />;
    }
  }
}

// const DashboardScreen = ({ navigation }) => <Dashboard navigation={navigation} />;
// DashboardScreen.navigationOptions = ({ navigation }) => ({
//   header: <DrawerButton navigation={navigation} />
// });

// const DashboardStack = createStackNavigator({
//   Dashboard: { screen: DashboardScreen }
// });

// DashboardStack.navigationOptions = {
//   drawerLabel: 'Dashboard',
//   drawerIcon: ({ tintColor }) => <MaterialIcons name="drafts" size={24} />
// };

// const Drawer = createDrawerNavigator(
//   {
//     Dashboard: {
//       path: '/',
//       screen: DashboardStack
//     }
//   },
//   {
//     initialRouteName: 'Dashboard',
//     contentOptions: {
//       // activeTintColor: '#e91e63'
//     }
//   }
// );

// const mapDispatchToProps = (dispatch) => {
//   return bindActionCreators({ pushSetup }, dispatch);
// };

// export default connect(null, mapDispatchToProps)(Drawer);

export default Dashboard;
