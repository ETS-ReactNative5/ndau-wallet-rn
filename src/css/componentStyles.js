import { StyleSheet, Platform } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'

export default StyleSheet.create({
  container: {
    flex: 1
  },
  statusBarColor: {
    backgroundColor: '#000000'
  },
  opaqueOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9
  },
  setupContainerOverlay: {
    position: 'absolute',
    top: hp('7%'),
    left: 0,
    right: 0,
    bottom: 0
  },
  setupContainerBackgroundImage: {
    height: '150%',
    width: '150%',
    bottom: 450,
    right: 80
  },
  largeText: {
    color: '#FFFFFF',
    fontFamily: 'Titillium Web',
    fontSize: 36,
    fontWeight: '600',
    letterSpacing: 0.77,
    lineHeight: 54,
    paddingLeft: wp('1%'),
    paddingRight: wp('1%'),
    marginLeft: wp('4%')
  },
  progressNumber: {
    color: '#FFFFFF',
    fontFamily: 'Titillium Web',
    fontSize: 22,
    letterSpacing: 0.39,
    lineHeight: 27,
    paddingLeft: wp('1%'),
    paddingRight: wp('1%'),
    marginTop: hp('0.6%')
  },
  paragraphText: {
    color: '#FFFFFF',
    fontFamily: 'Open Sans',
    fontSize: 18,
    letterSpacing: 0.39,
    lineHeight: 27,
    paddingLeft: wp('1%'),
    paddingRight: wp('1%'),
    marginRight: wp('4%'),
    marginLeft: wp('4%')
  },
  smallParagraphText: {
    color: '#ffffff',
    fontFamily: 'Open Sans',
    fontSize: 12,
    fontWeight: '400',
    letterSpacing: 0.26,
    lineHeight: 18,
    textAlign: 'center',
    marginLeft: wp('4%')
  },
  setupWelcomeContainer: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    marginRight: wp('4%'),
    marginTop: hp('10%'),
    marginBottom: hp('6%')
  },
  setupContainer: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    marginTop: hp('2%'),
    marginBottom: hp('2.5%')
  },
  setupButtonContainerTop: {
    // Due to how we have to fill the LinearGradient we
    // unfortunately lose flexbox, so we have to resort to
    // absolute positioning
    position: 'absolute',
    bottom: hp('9%'),
    marginLeft: wp('4%')
  },
  setupButtonContainerBottom: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 4,
    borderColor: '#4e957a',
    borderStyle: 'solid',
    borderWidth: 2,
    marginLeft: wp('4%')
  },
  setupButtonContainerBottomNoBorder: {
    position: 'absolute',
    bottom: 0,
    marginLeft: wp('4%')
  },
  underline: {
    width: wp('15%'),
    height: hp('.1%'),
    borderColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 3,
    marginLeft: wp('5%'),
    marginRight: wp('1%'),
    marginBottom: wp('5%')
  },
  largeButton: {
    width: wp('92%'),
    height: hp('6%'),
    borderRadius: 4,
    backgroundColor: '#4e957a'
  },
  largeButtonSecondary: {
    width: wp('91%'),
    height: hp('6%'),
    borderRadius: 4,
    backgroundColor: 'transparent'
  },
  largeButtonText: {
    color: '#ffffff',
    fontFamily: 'Titillium Web',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.43
  },
  progressBarContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'stretch',
    width: wp('100%'),
    height: hp('5%'),
    backgroundColor: '#0A1724',
    color: '#000000'
  },
  progressBar: {
    marginTop: hp('3%'),
    width: wp('70%')
  },
  backArrow: {
    marginTop: hp('1.6%')
  },
  centeredLinkText: {
    color: '#8CC74F',
    fontFamily: 'TitilliumWeb-Regular',
    fontSize: 18,
    textDecorationLine: 'underline',
    textAlign: 'center'
  },
  centeredLinkContainer: {
    position: 'absolute',
    bottom: 0
  },
  recoveryConfirmationBox: {
    width: wp('20%'),
    height: hp('6.2%'),
    borderRadius: 2,
    borderColor: '#4e957a',
    borderStyle: 'solid',
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  recoveryConfirmationText: {
    color: '#ffffff',
    fontFamily: 'Titillium Web',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.34,
    lineHeight: 24,
    textAlign: 'center'
  },
  recoveryConfirmationContainer: {
    position: 'absolute',
    top: hp('9%'),
    left: 0,
    right: 0,
    width: wp('100%'),
    height: hp('30%'),
    backgroundColor: '#293e63',
    paddingTop: hp('3%')
  },
  recoveryConfirmationRowView: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  }
})
