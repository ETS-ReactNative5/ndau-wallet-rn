import React from 'react'
import { View, TouchableOpacity, Slider } from 'react-native'
import { H4, P, Button } from 'nachos-ui'
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro'
import LinearGradient from 'react-native-linear-gradient'
import AccountAPIHelper from '../../helpers/AccountAPIHelper'
import { MainContainer, ContentContainer, CloseForBar } from '../common'
import CollapsibleBar from '../common/CollapsibleBar'
import styles from './styles'
import DateHelper from '../../helpers/DateHelper'
import AccountHistoryHelper from '../../helpers/AccountHistoryHelper'

export function AccountPanel (props) {
  return (
    <View style={styles.accountMainPanel}>
      <LinearGradient
        useAngle
        angle={135}
        angleCenter={{ x: 0.5, y: 0.5 }}
        locations={[0, 1.0]}
        colors={['#0F2748', '#293E63']}
        style={[styles.opaqueOverlay]}
      >
        <View style={styles.accountPanels}>
          <View style={styles.accountTitlePanel}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'center'
                }}
              >
                <H4 style={styles.accountTitleTextPanel}>
                  {AccountAPIHelper.accountNickname(props.account.addressData)}
                </H4>
                <FontAwesome5Pro
                  name={props.icon}
                  size={18}
                  color='#4B9176'
                  style={styles.accountNicknameIcon}
                  light
                />
                {props.accountNoticePeriod ? (
                  props.accountLockedUntil ? (
                    <FontAwesome5Pro
                      name='clock'
                      size={18}
                      color='#4B9176'
                      style={styles.accountNicknameIcon}
                      light
                    />
                  ) : (
                    <FontAwesome5Pro
                      name='clock'
                      size={18}
                      color='#CC8727'
                      style={styles.accountNicknameIcon}
                      light
                    />
                  )
                ) : null}
              </View>
              <View>
                <H4 style={styles.accountPanelTotal}>
                  {AccountAPIHelper.accountNdauAmount(
                    props.account.addressData
                  )}
                </H4>
              </View>
            </View>
            <View>
              <View style={styles.accountPanelBorder} />
            </View>
          </View>
          <View style={styles.accountButtonPanel}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              {props.children}
            </View>
          </View>
          <View style={styles.accountActionPanel}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <H4 style={styles.accountActionTextPanel}>
                View account details {'&'} settings
              </H4>
              <TouchableOpacity {...props}>
                <FontAwesome5Pro
                  name='chevron-circle-right'
                  size={24}
                  color='#4B9176'
                  style={styles.accountAngle}
                  solid
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  )
}

export function AccountDetailsContainer (props) {
  goBack = () => {
    props.navigation.goBack()
  }
  return (
    <MainContainer>
      <View style={{ flex: 1 }}>
        <LinearGradient
          start={{ x: 0.0, y: 0.02 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 0.05]}
          colors={['#0A1724', '#0F2748']}
          style={[styles.appContainerOverlay]}
        >
          <View style={styles.accountTitlePanel}>
            <AccountDetailsBar goBack={() => goBack()} {...props} />
          </View>
          <ContentContainer>{props.children}</ContentContainer>
        </LinearGradient>
      </View>
    </MainContainer>
  )
}

export function AccountLockContainer (props) {
  close = () => {
    props.navigation.navigate('WalletOverview', { wallet: props.wallet })
  }
  goBack = () => {
    props.navigation.goBack()
  }
  return (
    <MainContainer>
      <View style={{ flex: 1 }}>
        <LinearGradient
          start={{ x: 0.0, y: 0.02 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 0.05]}
          colors={['#0A1724', '#0F2748']}
          style={[styles.appContainerOverlay]}
        >
          <View style={styles.accountTitlePanel}>
            <AccountClosingBar
              closeBar
              close={this.close}
              goBack={this.goBack}
            />
          </View>
          <ContentContainer>{props.children}</ContentContainer>
        </LinearGradient>
      </View>
    </MainContainer>
  )
}

export function AccountHistoryContainer (props) {
  goBack = () => {
    props.navigation.goBack()
  }
  return (
    <MainContainer>
      <View style={{ flex: 1 }}>
        <LinearGradient
          start={{ x: 0.0, y: 0.02 }}
          end={{ x: 0.0, y: 1.0 }}
          locations={[0, 0.05]}
          colors={['#0A1724', '#0F2748']}
          style={[styles.appContainerOverlay]}
        >
          <View style={styles.accountTitlePanel}>
            <AccountClosingBar
              backArrowStyle={styles.backArrowForHistory}
              goBack={this.goBack}
              {...props}
            />
          </View>
          <ContentContainer>{props.children}</ContentContainer>
        </LinearGradient>
      </View>
    </MainContainer>
  )
}

export function AccountButton (props) {
  return (
    <Button
      style={styles.accountButton}
      textStyle={styles.accountButtonText}
      uppercase={false}
      {...props}
    >
      {props.children}{' '}
      <FontAwesome5Pro
        name={props.icon}
        size={18}
        color='#4B9176'
        style={styles.accountAngle}
        light
      />
    </Button>
  )
}

export function LargeAccountButton (props) {
  return (
    <Button
      style={styles.largeAccountButton}
      textStyle={styles.accountButtonText}
      uppercase={false}
      {...props}
    >
      {props.children}{' '}
      <FontAwesome5Pro
        name={props.icon}
        size={18}
        color='#4B9176'
        style={styles.accountAngle}
        light
      />
    </Button>
  )
}

export function AccountTotalPanel (props) {
  return (
    <View style={styles.accountTotalPanel}>
      <View>
        <H4 style={styles.accountTotalPanelText}>
          {AccountAPIHelper.accountNdauAmount(props.account.addressData)}
        </H4>
      </View>
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
          <H4 style={styles.historyAccountPanelText}>View history</H4>
          <TouchableOpacity {...props}>
            <FontAwesome5Pro
              name='chevron-circle-right'
              size={24}
              color='#4B9176'
              style={styles.viewHistoryAngle}
              solid
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export function AccountLockDetailsPanel (props) {
  return (
    <View style={styles.accountDetailsPanel}>
      <View>{props.children}</View>
    </View>
  )
}

export function AccountDetailsPanel (props) {
  return (
    <View style={styles.accountDetailsPanel}>
      <View style={styles.accountDetailsTextPanelWithButton}>
        <View>
          {props.accountNotLocked ? (
            <H4 style={styles.accountDetailsLargerText}>Unlocked</H4>
          ) : (
            <H4 style={styles.accountDetailsLargerText}>
              Locked ({props.accountNoticePeriod} day countdown)
            </H4>
          )}
        </View>
        <View>
          {props.accountNotLocked ? (
            <AccountButton
              onPress={() => props.showLock(props.account, props.wallet)}
              icon='lock'
            >
              Lock
            </AccountButton>
          ) : (
            <AccountButton icon='lock-open'>Unlock</AccountButton>
          )}
        </View>
      </View>
      <View style={styles.accountDetailsTextPanel}>
        <H4 style={styles.accountDetailsLargerText}>
          {props.eaiPercentage}% annualized incentive (EAI)
        </H4>
      </View>
      <View style={styles.accountDetailsPanelBorder} />
      <View style={styles.accountDetailsTextPanelWithSmallText}>
        <View>
          <H4 style={styles.accountDetailsSmallerText}>
            Weighted average age (WAA):
          </H4>
        </View>
        <View>
          <H4 style={styles.accountDetailsSmallerTextBold}>
            {props.weightedAverageAge}
          </H4>
        </View>
      </View>
      <View style={styles.accountDetailsTextPanelWithSmallText}>
        <View>
          <H4 style={styles.accountDetailsSmallerText}>
            Current EAI based on WAA:
          </H4>
        </View>
        <View>
          <H4 style={styles.accountDetailsSmallerTextBold}>
            {props.eaiPercentage}%
          </H4>
        </View>
      </View>
      {props.sendingEAITo ? (
        <View style={styles.accountDetailsTextPanelWithSmallText}>
          <View>
            <H4 style={styles.accountDetailsSmallerText}>EAI being sent to:</H4>
          </View>
          <View>
            <H4 style={styles.accountDetailsSmallerTextBold}>
              {props.sendingEAITo}
            </H4>
          </View>
        </View>
      ) : null}
    </View>
  )
}

export function AccountDetailsBar (props) {
  return (
    <View style={styles.accountDetailsBarContainer}>
      <View style={styles.backArrow}>
        <TouchableOpacity onPress={props.goBack}>
          <FontAwesome5Pro size={28} name='arrow-left' color='#4B9176' light />
        </TouchableOpacity>
      </View>
      <H4 style={[styles.accountDetailsBarText]}>
        {props.account.addressData
          ? props.account.addressData.nickname
          : 'Account'}{' '}
        details
      </H4>
      <View style={styles.detailsBarCog}>
        <FontAwesome5Pro size={18} name='cog' color='#FFFFFF' light />
      </View>
    </View>
  )
}

export function AccountClosingBar (props) {
  return (
    <View style={styles.accountDetailsBarContainer}>
      <View style={[styles.backArrow, props.backArrowStyle]}>
        <TouchableOpacity onPress={props.goBack}>
          <FontAwesome5Pro size={28} name='arrow-left' color='#4B9176' light />
        </TouchableOpacity>
      </View>
      <H4 style={[styles.accountDetailsBarText]}>{props.title}</H4>
      {props.closeBar ? <CloseForBar {...props} /> : null}
    </View>
  )
}

export function AccountLockButton (props) {
  return (
    <View style={styles.accountLockButtonContainer}>
      <View>
        <H4 style={styles.lockSmallerText}>{props.smallText}</H4>
      </View>
      <Button
        style={styles.accountLargeButton}
        textStyle={styles.accountLargeButtonText}
        uppercase={false}
        {...props}
      >
        {props.children}
      </Button>
    </View>
  )
}

export function AccountLockLargerText (props) {
  return (
    <View style={styles.accountLockDetailsTextPanel}>
      <H4 style={styles.accountDetailsLargerText}>{props.children}</H4>
    </View>
  )
}

export function AccountBorder (props) {
  return <View style={styles.accountDetailsPanelBorder} />
}

export function AccountCheckmarkText (props) {
  return (
    <View style={styles.lockAccountTextPanelWithSmallText}>
      <View style={styles.lockAccountCheckmark}>
        <FontAwesome5Pro size={18} name='check' color='#85BE4D' light />
      </View>
      <View>
        <H4 style={styles.accountDetailsSmallerText}>{props.children}</H4>
      </View>
    </View>
  )
}

export function AccountLockSmallerText (props) {
  return (
    <View>
      <H4 style={styles.lockSmallerTextBold}>{props.children}</H4>
    </View>
  )
}

export function AccountLockSlider (props) {
  return (
    <View style={styles.lockSliderContainer}>
      <Slider
        maximumTrackTintColor='#4E957A'
        minimumTrackTintColor='#4E957A'
        step={0.25}
        style={styles.lockSlider}
        {...props}
      />
    </View>
  )
}

export function AccountHistoryMainPanel (props) {
  return <View style={styles.accountHistoryMainPanel}>{props.children}</View>
}

export function AccountHistoryPanels (props) {
  if (!AccountHistoryHelper.hasItems(props.accountHistory)) {
    return null
  }

  return props.accountHistory.Items.map((item, index) => {
    return (
      <CollapsibleBar
        key={index}
        title={AccountHistoryHelper.getTransactionDate(item)}
        collapsible
        showOnStart={false}
        iconCollapsed='angle-down'
        iconActive='angle-down'
        iconOpened='angle-up'
        tintColor='#4B9176'
        lowerBorder
      >
        <View style={styles.accountHistoryTextPanelWithSmallText}>
          <View>
            <H4 style={styles.accountHistorySmallerTextBold}>
              Transaction ID:
            </H4>
          </View>
          <View>
            <H4 style={styles.accountHistorySmallerText}>
              {AccountHistoryHelper.getTransactionId(item)}
            </H4>
          </View>
        </View>
      </CollapsibleBar>
    )
  })
}

export function DashboardTotalPanel (props) {
  return (
    <CollapsibleBar
      {...props}
      style={styles.dashboardTotalPanel}
      titleStyle={styles.dashboardTotalTitleLeft}
      collapsible
      showOnStart={false}
      iconCollapsed='angle-down'
      iconActive='angle-down'
      iconOpened='angle-up'
      tintColor='#4B9176'
      upperBorder
    >
      <View style={styles.dashboardTotalPanelTextContainer}>
        <P style={styles.totalAsterickTextVerySmallWhite}>
          * The estimated value of ndau in US dollars can be calculated using
          the Target Price at which new ndau have most recently been issued. The
          value shown here is calculated using that method as of the issue price
          on {DateHelper.getTodaysDate()}. The Axiom Foundation, creator and
          issuer of ndau, bears no responsibility or liability for the
          calculation of that estimated value, or for decisions based on that
          estimated value.
        </P>
      </View>
    </CollapsibleBar>
  )
}
