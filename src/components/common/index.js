import React from 'react'
import {
  View,
  ScrollView,
  StatusBar,
  ImageBackground,
  TouchableOpacity,
  Text
} from 'react-native'
import { SafeAreaView } from 'react-navigation'
import componentStyles from '../../css/componentStyles'
import { Button, Progress, H4 } from 'nachos-ui'
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro'
import LinearGradient from 'react-native-linear-gradient'
import { ParagraphText, SmallParagraphText } from '../setup'

export function LargeButtons (props) {
  return (
    <View
      style={
        props.bottom
          ? props.secondary
            ? componentStyles.setupButtonContainerBottom
            : componentStyles.setupButtonContainerBottomNoBorder
          : componentStyles.setupButtonContainerTop
      }
    >
      {props.text ? (
        <SmallParagraphText>{props.text}</SmallParagraphText>
      ) : null}
      <Button
        style={
          props.secondary
            ? componentStyles.largeButtonSecondary
            : componentStyles.largeButton
        }
        textStyle={componentStyles.largeButtonText}
        uppercase={false}
        {...props}
      >
        {props.children}
      </Button>
    </View>
  )
}

export function LargeButton (props) {
  return (
    <View style={componentStyles.setupButtonContainerBottomNoBorder}>
      <Button
        style={componentStyles.largeButton}
        textStyle={componentStyles.largeButtonText}
        uppercase={false}
        {...props}
      >
        {props.children}
      </Button>
    </View>
  )
}

export function BottomLinkText (props) {
  return (
    <View style={[componentStyles.centeredLinkContainer, { left: props.left }]}>
      <Text {...props} style={componentStyles.centeredLinkText}>
        {props.children}
      </Text>
    </View>
  )
}

export const NEW_WALLET_SETUP_TYPE = 'new'
export const RECOVERY_WALLET_SETUP_TYPE = 'recovery'

const SETUP_SCREEN_TOTAL = 19

export function ProgressBar (props) {
  return (
    <View style={componentStyles.progressBarContainer}>
      <View style={componentStyles.backArrow}>
        <TouchableOpacity onPress={props.goBack}>
          <FontAwesome5Pro size={28} name='arrow-left' color='#4B9176' light />
        </TouchableOpacity>
      </View>
      <Progress
        progress={props.pageNumber ? props.pageNumber / SETUP_SCREEN_TOTAL : 0}
        color='#4E957A'
        style={componentStyles.progressBar}
      />
      <H4 style={[componentStyles.progressNumber]}>
        {props.pageNumber
          ? Math.round(props.pageNumber / SETUP_SCREEN_TOTAL / 0.01)
          : '0'}
        %
      </H4>
    </View>
  )
}
