import React from 'react'
import { View, TouchableOpacity, Share } from 'react-native'
import { H4, H3, P, Button } from 'nachos-ui'
import FontAwesome5Pro from 'react-native-vector-icons/FontAwesome5Pro'
import LinearGradient from 'react-native-linear-gradient'
import AccountAPIHelper from '../../helpers/AccountAPIHelper'
import {
  MainContainer,
  ContentContainer,
  CloseForBar,
  TitleBarGradient,
  AccountDetailsTitleBarGradient,
  FullBarBorder
} from '../common'
import CollapsibleBar from '../common/CollapsibleBar'
import styles from './styles'
import DateHelper from '../../helpers/DateHelper'
import AccountHistoryHelper from '../../helpers/AccountHistoryHelper'
import AppConstants from '../../AppConstants'
import ndaujs from 'ndaujs'

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
                  color={AppConstants.ICON_BUTTON_COLOR}
                  style={styles.accountNicknameIcon}
                  light
                />
                {props.accountNoticePeriod ? (
                  props.accountLockedUntil ? (
                    <FontAwesome5Pro
                      name='clock'
                      size={18}
                      color={AppConstants.ICON_BUTTON_COLOR}
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
              <View style={styles.ndauTotalContainer}>
                <View>
                  <P style={styles.ndauSmall}>n</P>
                </View>
                <View>
                  <H4 style={styles.accountPanelTotal}>
                    {AccountAPIHelper.accountNdauAmount(
                      props.account.addressData
                    )}
                  </H4>
                </View>
              </View>
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
                  color={AppConstants.ICON_BUTTON_COLOR}
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

export function WalletOverviewHeaderActions (props) {
  return (
    <View style={styles.walletOverviewHeaderActions}>{props.children}</View>
  )
}

export function AccountDetailsContainer (props) {
  goBack = () => {
    props.navigation.goBack()
  }
  return (
    <MainContainer>
      <View style={{ flex: 1 }}>
        <AccountDetailsTitleBarGradient>
          <View style={styles.accountDetailsTitlePanel}>
            <AccountDetailsBar goBack={() => goBack()} {...props} />
            <FullBarBorder />
          </View>
          <ContentContainer>{props.children}</ContentContainer>
        </AccountDetailsTitleBarGradient>
      </View>
    </MainContainer>
  )
}

export function AccountLockContainer (props) {
  close = () => {
    props.navigation.push('WalletOverview', { wallet: props.wallet })
  }
  return (
    <MainContainer>
      <View style={{ flex: 1 }}>
        <TitleBarGradient>
          <View style={styles.accountTitlePanel}>
            <AccountClosingBar
              title={props.title}
              closeBar
              close={this.close}
            />
          </View>
          <ContentContainer>{props.children}</ContentContainer>
        </TitleBarGradient>
      </View>
    </MainContainer>
  )
}

export function AccountUnlockContainer (props) {
  close = () => {
    props.navigation.push('AccountDetails', { account: props.account })
  }
  return (
    <MainContainer>
      <View style={{ flex: 1 }}>
        <TitleBarGradient>
          <View style={styles.accountTitlePanel}>
            <AccountClosingBar
              title={props.title}
              closeBar
              close={this.close}
            />
          </View>
          <ContentContainer style={styles.accountContentPanel}>
            {props.children}
          </ContentContainer>
        </TitleBarGradient>
      </View>
    </MainContainer>
  )
}

export function AccountSendContainer (props) {
  close = () => {
    props.navigation.push('WalletOverview', { wallet: props.wallet })
  }
  return (
    <MainContainer>
      <View style={{ flex: 1 }}>
        <TitleBarGradient>
          <View style={styles.accountTitlePanel}>
            <AccountClosingBar
              title={props.title}
              closeBar
              close={this.close}
            />
          </View>
          <ContentContainer style={styles.accountContentPanel}>
            {props.children}
          </ContentContainer>
        </TitleBarGradient>
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
        <TitleBarGradient>
          <View style={styles.accountTitlePanel}>
            <AccountClosingBar
              backArrowStyle={styles.backArrowForHistory}
              backBar
              goBack={this.goBack}
              {...props}
            />
          </View>
          <ContentContainer>{props.children}</ContentContainer>
        </TitleBarGradient>
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
        name={props.customIconName}
        size={18}
        color={AppConstants.ICON_BUTTON_COLOR}
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
        name={props.customIconName}
        size={18}
        color={AppConstants.ICON_BUTTON_COLOR}
        style={styles.accountAngle}
        light
      />
    </Button>
  )
}

export function AccountTotalPanel (props) {
  return (
    <View style={styles.accountTotalPanel}>
      <View style={styles.ndauTotalContainerMedium}>
        <P style={styles.ndauMedium}>n</P>
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
              color={AppConstants.ICON_BUTTON_COLOR}
              style={styles.viewHistoryAngle}
              light
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}

export function AccountDetailsButtonPanel (props) {
  return (
    <View style={styles.accountDetailsButtonPanel}>
      <View>
        <AccountButton
          onPress={() => props.send(props.account, props.wallet)}
          customIconName='arrow-alt-up'
        >
          Send
        </AccountButton>
      </View>
      <View>
        <AccountButton
          onPress={() => props.receive(props.account, props.wallet)}
          customIconName='arrow-alt-down'
        >
          Receive
        </AccountButton>
      </View>
      <View>
        <AccountButton
          onPress={() => props.showLock(props.account, props.wallet)}
          customIconName='lock'
        >
          Lock
        </AccountButton>
      </View>
    </View>
  )
}

export function AccountLockDetailsPanel (props) {
  return (
    <View style={styles.accountLockPanel}>
      <View>{props.children}</View>
    </View>
  )
}

export function AccountReceiveParagraphText (props) {
  return <P style={styles.accountReceiveParagraphText}>{props.children}</P>
}

export function AccountParagraphText (props) {
  return (
    <View style={styles.accountDetailsItemPanel}>
      {props.customIconName ? (
        <View>
          <FontAwesome5Pro
            name={props.customIconName}
            size={18}
            color={props.customIconColor || AppConstants.ICON_BUTTON_COLOR}
            style={styles.accountDetailsIcons}
            solid
          />
        </View>
      ) : null}
      <View>
        <P style={styles.accountDetailsParagraphText}>{props.children}</P>
      </View>
    </View>
  )
}

export function AccountHeaderText (props) {
  return <H3 style={styles.accountDetailsLargerText}>{props.children}</H3>
}

export function AccountDetailsPanel (props) {
  let firstPanel = {}
  if (props.firstPanel) {
    firstPanel = styles.firstAccountDetailsPanel
  }
  return (
    <View style={[styles.accountDetailsPanel, firstPanel]}>
      {props.children}
    </View>
  )
}

export function AccountDetailsBar (props) {
  return (
    <View style={styles.accountDetailsBarContainer}>
      <View style={styles.backArrow}>
        <TouchableOpacity onPress={props.goBack}>
          <FontAwesome5Pro
            size={32}
            name='arrow-left'
            color={AppConstants.ICON_BUTTON_COLOR}
            style={styles.accountAngle}
            light
          />
        </TouchableOpacity>
      </View>
      <H4 style={[styles.accountDetailsBarText]}>
        {props.account.addressData
          ? props.account.addressData.nickname
          : 'Account'}{' '}
        details
      </H4>
      <View style={styles.detailsBarCog} />
    </View>
  )
}

export function AccountClosingBar (props) {
  return (
    <View style={styles.accountClosingBarContainer}>
      {props.backBar ? (
        <View style={[styles.backArrow, props.backArrowStyle]}>
          <TouchableOpacity onPress={props.goBack}>
            <FontAwesome5Pro
              size={32}
              name='arrow-left'
              color={AppConstants.ICON_BUTTON_COLOR}
              light
            />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.backArrow} />
      )}

      <H4 style={[styles.accountDetailsBarText]}>{props.title}</H4>
      {props.closeBar ? (
        <CloseForBar style={styles.closeIcon} {...props} />
      ) : (
        <View />
      )}
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
      <H4 style={styles.accountDetailsParagraphText}>{props.children}</H4>
    </View>
  )
}

export function AccountDetailsLargerText (props) {
  return (
    <View style={[styles.accountDetailsTextPanelTopMargin]}>
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

export function AccountHistoryPanel (props) {
  return <View style={styles.accountHistoryPanel}>{props.children}</View>
}

export function AccountDetailPanel (props) {
  return <View style={styles.accountDetailsPanel}>{props.children}</View>
}

export function AccountScanPanel (props) {
  return <View style={styles.accountScan}>{props.children}</View>
}

export function AccountHistoryPanels (props) {
  if (!AccountHistoryHelper.hasItems(props.accountHistory)) {
    return null
  }

  return props.accountHistory.Items.map((item, index) => {
    const transactionDestination = AccountHistoryHelper.getTransactionDestination(
      item
    )
    const transactionSource = AccountHistoryHelper.getTransactionSource(item)
    const destinationUsed =
      transactionDestination && props.address !== transactionDestination
    const sourceUsed = transactionSource && props.address !== transactionSource

    return (
      <CollapsibleBar
        key={index}
        title={AccountHistoryHelper.getTransactionDate(item)}
        titleMiddle={AccountHistoryHelper.getTransactionType(item)}
        titleRight={AccountHistoryHelper.getTransactionBalance(item)}
        collapsible
        showOnStart={false}
        iconCollapsed='angle-down'
        iconActive='angle-down'
        iconOpened='angle-up'
        tintColor={AppConstants.ICON_BUTTON_COLOR}
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
        {destinationUsed ? (
          <View style={styles.accountHistoryTextPanelWithSmallText}>
            <View>
              <H4 style={styles.accountHistorySmallerTextBold}>Sent to:</H4>
            </View>
            <View>
              <H4 style={styles.accountHistorySmallerText}>
                {ndaujs.truncateAddress(transactionDestination)}
              </H4>
            </View>
          </View>
        ) : null}
        {sourceUsed ? (
          <View style={styles.accountHistoryTextPanelWithSmallText}>
            <View>
              <H4 style={styles.accountHistorySmallerTextBold}>
                Received from:
              </H4>
            </View>
            <View>
              <H4 style={styles.accountHistorySmallerText}>
                {ndaujs.truncateAddress(transactionSource)}
              </H4>
            </View>
          </View>
        ) : null}
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
      tintColor={AppConstants.ICON_BUTTON_COLOR}
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

export function AccountConfirmationItem (props) {
  return (
    <View style={styles.accountSendTextPanelWithSmallText}>
      <View>
        <H4
          style={
            props.largerText
              ? styles.accountHistoryLargerTextBold
              : styles.accountHistorySmallerTextBold
          }
        >
          {props.title}
        </H4>
      </View>
      <View>
        <H4
          style={
            props.largerText
              ? styles.accountHistoryLargerTextBold
              : styles.accountHistorySmallerText
          }
        >
          {props.value}
        </H4>
      </View>
    </View>
  )
}

export function AccountSendErrorText (props) {
  return (
    <View style={styles.accountSendErrorSmallText}>
      <View>
        <H4
          style={[
            styles.accountHistorySmallerText,
            styles.accountSendErrorColor
          ]}
        >
          {props.children}
        </H4>
      </View>
    </View>
  )
}

export function AccountLockOption (props) {
  let selectedStyle = {}
  if (props.selected) {
    selectedStyle = styles.accountLockOptionSelected
  }
  return (
    <TouchableOpacity {...props}>
      <View style={[styles.accountLockOption, selectedStyle]}>
        <P style={styles.accountLockOptionText}>{`${props.base}%`}</P>
        <P style={styles.accountLockOptionText}>+</P>
        <P style={styles.accountLockOptionText}>{`${props.bonus}%`}</P>
        <P style={styles.accountLockOptionText}>=</P>
        <P style={styles.accountLockOptionTextWithBorder}>{`${
          props.total
        }%`}</P>
        <P style={styles.accountLockOptionText} />
        <P style={styles.accountLockOptionText} />
        <P style={styles.accountLockOptionHeaderText}>{`${
          props.lock
        } months`}</P>
        {props.selected ? (
          <FontAwesome5Pro
            style={styles.accountLockCheckbox}
            size={18}
            name='check'
            color='#85BE4D'
            light
          />
        ) : null}
      </View>
    </TouchableOpacity>
  )
}

export function AccountLockOptionHeader (props) {
  return (
    <View style={styles.accountLockOptionHeader}>
      <P style={styles.accountLockOptionHeaderText}>Base</P>
      <P style={styles.accountLockOptionHeaderText}>Bonus</P>
      <P style={styles.accountLockOptionHeaderText} />
      <P style={styles.accountLockOptionHeaderText} />
      <P style={styles.accountLockOptionHeaderText}>Lock</P>
    </View>
  )
}

export function AddressSharePanel (props) {
  const address = ndaujs.truncateAddress(props.address)

  share = address => {
    Share.share(
      {
        message: address,
        title: 'Share public ndau address',
        url: '/'
      },
      {
        dialogTitle: 'Share public ndau address'
      }
    )
  }

  let transparentBackground = {}
  if (props.transparent) {
    transparentBackground = {
      backgroundColor: 'transparent'
    }
  }

  let noPadding = {}
  if (props.noPadding) {
    noPadding = { paddingHorizontal: 0 }
  }

  return (
    <View
      style={
        props.scroll
          ? styles.addressCopyPanelContainerScrollView
          : styles.addressCopyPanelContainerBottomNoBorder
      }
    >
      <View
        style={[
          styles.addressCopyPanel,
          transparentBackground,
          noPadding,
          props.style
        ]}
        {...props}
      >
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between'
          }}
        >
          <View>
            <P style={styles.addressCopyPanelText}>{address}</P>
          </View>
          <View>
            <Button
              style={styles.addressShareButton}
              textStyle={styles.addressButtonText}
              uppercase={false}
              onPress={() => this.share(props.address)}
              {...props}
            >
              Share
            </Button>
          </View>
        </View>
      </View>
    </View>
  )
}
