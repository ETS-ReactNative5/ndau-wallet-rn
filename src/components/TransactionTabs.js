import React, { Component } from 'react'
import { StyleSheet, Text, View, Share } from 'react-native'
import QRCode from 'react-native-qrcode'
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import CommonButton from '../components/CommonButton'

class TransactionTabs extends Component {
  render () {
    // const SendWithProps = () => <Send {...this.props} />;
    const ReceiveWithProps = () => <Receive {...this.props} />

    const Navigator = createMaterialTopTabNavigator(
      {
        Receive: ReceiveWithProps,
        // Send: SendWithProps,

        Receive: {
          screen: ReceiveWithProps,
          navigationOptions: ({ navigation }) => ({
            title: 'Receive ndau',
          }),
        },
      
      },
      {
        animationEnabled: false,
        tabBarOptions,
        navigationOptions
      }
    )

    return <Navigator />
  }
}

class Receive extends Component {
  shareAddress = () => {
    Share.share(
      {
        message: this.props.address,
        title: 'Share your public address',
        url: '/'
      },
      {
        dialogTitle: 'Share your public address'
      }
    )
  }

  render () {
    return (
      <View style={styles.container}>
        <View style={{ alignSelf: 'center' }}>
          <QRCode
            value={this.props.address}
            size={250}
            color='black'
            backgroundColor='white'
          />
        </View>

        <Text style={styles.address}>
          {this.props.address}
        </Text>

        <View styles={{ flex: 1 }}>
          <CommonButton
            title='Share address'
            onPress={this.shareAddress}
            iconProps={{
              name: 'share-square',
              color: '#000',
              size: 20
            }}
          />
        </View>
      </View>
    )
  }
}

// class Send extends Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       amount: 0
//     }
//   }

//   send = () => {
//     // TODO: transfer funds
//   }

//   render() {
//     return (
//       <View>
//         {/* TODO: add Send form */}

//         <View styles={{flex: 1}}>
//           <CommonButton
//             title={`send ${this.state.amount}`}
//             onPress={this.send}
//           />
//         </View>
//       </View>
//     );
//   }
// }

const tabBarOptions = {
  upperCaseLabel: false,
  labelStyle: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  tabStyle: {
    backgroundColor: 'transparent'
  },
  indicatorStyle: {
    backgroundColor: '#ffffff'
  },
  style: {
    backgroundColor: 'transparent'
  }
}

const navigationOptions = {
  swipeEnabled: false
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    // alignItems: 'center',
    justifyContent: 'space-around'
  },
  address: {
    color: '#ffffff',
    fontSize: 13,
    fontFamily: 'TitilliumWeb-300',
    marginTop: hp('0.5%'),
    marginBottom: hp('0.5%'),
    marginLeft: wp('1%'),
    marginRight: wp('1%')
  }
})

export default TransactionTabs
