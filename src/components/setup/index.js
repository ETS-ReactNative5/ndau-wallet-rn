import React from 'react'
import {
  View,
  ScrollView,
  ImageBackground,
  TouchableOpacity
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { H4, Progress, P, Input } from 'nachos-ui'
import { ProgressBar, MainContainer } from '../common'
import styles from './styles'

export function SetupWelcomeContainer ({ children }) {
  return (
    <MainContainer>
      <ImageBackground
        source={require('img/bloom.jpg')}
        style={styles.setupContainerBackgroundImage}
        resizeMode='contain'
      />
      <LinearGradient
        start={{ x: 0.0, y: 0.2 }}
        end={{ x: 0.5, y: 1.0 }}
        locations={[0, 0.5037, 1.0]}
        colors={['#0F2748', '#293E63', '#0F2748']}
        style={[styles.opaqueOverlay]}
      >
        <View style={styles.setupWelcomeContainer}>{children}</View>
      </LinearGradient>
    </MainContainer>
  )
}

export function SetupContainer (props) {
  goBack = () => {
    props.navigation.goBack()
  }
  return (
    <MainContainer>
      <View style={{ flex: 1 }}>
        <ProgressBar goBack={() => goBack()} pageNumber={props.pageNumber} />
        <LinearGradient
          locations={[0, 1.0]}
          colors={['#0F2748', '#293E63']}
          style={[styles.setupContainerOverlay]}
        >
          <View style={styles.setupContainer}>{props.children}</View>
        </LinearGradient>
      </View>
    </MainContainer>
  )
}

export function SetupContainerWithScrollView (props) {
  goBack = () => {
    props.navigation.goBack()
  }
  return (
    <MainContainer>
      <View style={{ flex: 1 }}>
        <ProgressBar goBack={() => goBack()} pageNumber={props.pageNumber} />
        <LinearGradient
          locations={[0, 1.0]}
          colors={['#0F2748', '#293E63']}
          style={[styles.setupContainerOverlay]}
        >
          <ScrollView style={styles.setupContainerWithScrollView}>
            {props.children}
          </ScrollView>
        </LinearGradient>
      </View>
    </MainContainer>
  )
}

export function LargeText ({ children }) {
  return <H4 style={[styles.largeText]}>{children}</H4>
}

export function UnderlineDivider ({ children }) {
  return <Progress style={styles.underline} />
}

export function ParagraphText (props) {
  return (
    <P style={[styles.paragraphText]} {...props}>
      {props.children}
    </P>
  )
}

export function SmallParagraphText (props) {
  return (
    <P style={[styles.smallParagraphText]} {...props}>
      {props.children}
    </P>
  )
}

export function RecoveryConfirmationText (props) {
  return (
    <P style={[styles.recoveryConfirmationText]} {...props}>
      {props.children}
    </P>
  )
}

export function RecoveryConfirmationTextOnly (props) {
  return (
    <P style={[styles.recoveryConfirmationTextOnly]} {...props}>
      {props.children}
    </P>
  )
}

export function RecoveryPhraseConfirmation (props) {
  return (
    <View style={styles.recoveryConfirmationContainer}>
      {props.words.map((row, rowIndex) => {
        return (
          <View key={rowIndex} style={styles.recoveryConfirmationRowView}>
            {row.map((item, index) => {
              return (
                <View key={index} style={[styles.recoveryConfirmationBox]}>
                  <RecoveryConfirmationText>{item}</RecoveryConfirmationText>
                </View>
              )
            })}
          </View>
        )
      })}
    </View>
  )
}

export function RecoveryPhraseConfirmationButtons (props) {
  return (
    <View style={styles.recoveryConfirmationButtonContainer}>
      {props.words.map((row, rowIndex) => {
        return (
          <View key={rowIndex} style={styles.recoveryConfirmationRowView}>
            {row.map((item, index) => {
              const i = index + row.length * rowIndex
              return (
                <TouchableOpacity
                  key={index}
                  onPress={event => props.handleClick(i, event)}
                >
                  <RecoveryPhraseConfirmationButton
                    error={props.errorWord == i}
                    selected={props.selected[i]}
                  >
                    <RecoveryConfirmationText>{item}</RecoveryConfirmationText>
                  </RecoveryPhraseConfirmationButton>
                </TouchableOpacity>
              )
            })}
          </View>
        )
      })}
    </View>
  )
}

export function RecoveryPhraseConfirmationButton (props) {
  let bgColor = '#4e957a'
  if (props.error) {
    bgColor = '#f05123'
  } else if (props.selected) {
    bgColor = '#A0CFBD'
  }
  return (
    <View
      style={[
        styles.recoveryConfirmationButtonBox,
        { backgroundColor: bgColor }
      ]}
    >
      {props.children}
    </View>
  )
}

export function RecoveryPhraseConfirmationTextOnly (props) {
  return (
    <View style={styles.recoveryConfirmationContainerTextOnly}>
      {props.words.map((row, rowIndex) => {
        return (
          <View
            key={rowIndex}
            style={styles.recoveryConfirmationRowViewTextOnly}
          >
            {row.map((item, index) => {
              return (
                <RecoveryConfirmationTextOnly key={index}>
                  {' '}
                  {item}{' '}
                </RecoveryConfirmationTextOnly>
              )
            })}
          </View>
        )
      })}
    </View>
  )
}
