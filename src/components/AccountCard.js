import React, { Component } from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
import CollapsiblePanel from '../components/CollapsiblePanel'
import cssStyles from '../css/styles'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'

const SEND_AND_RECEIVE_ICON = require('img/send_receive_both.png')
const RECEIVE_ONLY_ICON = require('img/receive_only.png')

class AccountCard extends Component {
  render () {
    const {
      index,
      nickname,
      address,
      eaiPercentage,
      sendingEAITo,
      receivingEAIFrom,
      accountBalance,
      accountLockedUntil,
      accountNoticePeriod,
      accountNotLocked,
      totalNdau,
      lock,
      unlock,
      startTransaction,
      walletId
    } = this.props

    const transactionIcon = accountNotLocked
      ? SEND_AND_RECEIVE_ICON
      : RECEIVE_ONLY_ICON

    return (
      <CollapsiblePanel
        index={index}
        title={nickname}
        titleRight={accountBalance}
        lockAdder={accountNotLocked ? 0 : 3}
        onNotice={!!accountLockedUntil}
      >
        {eaiPercentage
          ? <Text style={cssStyles.text}>
            {eaiPercentage}
            {'%'} annualized EAI
            </Text>
          : null}
        {sendingEAITo
          ? <Text style={cssStyles.text}>
              Sending incentive {'('}EAI{')'} to {sendingEAITo}
          </Text>
          : null}
        {receivingEAIFrom
          ? <Text style={cssStyles.text}>
              Receiving incentive {'('}EAI{')'} to {receivingEAIFrom}
          </Text>
          : null}
        {accountLockedUntil
          ? <Text style={cssStyles.text}>
              Account will be unlocked {accountLockedUntil}
          </Text>
          : null}
        {accountNoticePeriod
          ? <Text style={cssStyles.text}>
              Locked {'('}
            {accountNoticePeriod} day countdown{')'}
          </Text>
          : null}
        {accountNotLocked
          ? <Text style={cssStyles.text}>This account is not locked</Text>
          : null}
        <Text style={cssStyles.text}>In wallet {walletId}</Text>

        {totalNdau !== 0 &&
          <View style={[cssStyles.accountCardImageView]}>
            {accountLockedUntil
              ? <Image
                style={{
                  width: 23,
                  height: 35,
                  marginLeft: wp('1.5%')
                }}
                source={require('img/lock_countdown_animation_white.gif')}
                />
              : null}
            <TouchableOpacity onPress={unlock}>
              {accountNoticePeriod && !accountLockedUntil
                ? <Image
                  style={{
                    width: 23,
                    height: 35,
                    marginLeft: wp('1.5%')
                  }}
                  source={require('img/locked.png')}
                  />
                : null}
            </TouchableOpacity>
            <TouchableOpacity onPress={lock}>
              {accountNotLocked
                ? <Image
                  style={{
                    width: 30,
                    height: 35,
                    marginLeft: wp('1.5%')
                  }}
                  source={require('img/unlocked.png')}
                  />
                : null}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => startTransaction(address)}>
              <Image
                source={transactionIcon}
                style={{
                  width: 35,
                  height: 35,
                  marginLeft: wp('1.5%')
                }}
              />
            </TouchableOpacity>
          </View>}
      </CollapsiblePanel>
    )
  }
}

export default AccountCard
