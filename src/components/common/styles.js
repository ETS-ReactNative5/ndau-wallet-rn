import { StyleSheet, Platform } from 'react-native'
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from 'react-native-responsive-screen'
import AppConstants from '../../AppConstants'

export default StyleSheet.create({
  container: {
    flex: 1
  },
  statusBarColor: {
    backgroundColor: '#0A1724'
  },
  appContainer: {
    flex: 1,
    width: wp('100%'),
    height: hp('100%'),
    marginTop: hp('1%')
  },
  closeForBar: {
    ...Platform.select({
      ios: {
        marginTop: hp('1.1%')
      },
      android: {
        marginTop: hp('1%')
      }
    }),
    marginRight: wp('4%')
  },
  setupButtonContainerBottom: {
    position: 'absolute',
    bottom: 0,
    borderRadius: 4,
    borderColor: AppConstants.SQUARE_BUTTON_COLOR,
    borderStyle: 'solid',
    borderWidth: 2,
    marginLeft: wp('4%')
  },
  setupButtonContainerBottomNoBorder: {
    ...Platform.select({
      ios: {
        bottom: hp('4%')
      }
    }),
    bottom: hp('6%')
  },
  setupButtonContainerScrollView: {
    marginTop: hp('1%')
  },
  setupButtonContainerTop: {
    // Due to how we have to fill the LinearGradient we
    // unfortunately lose flexbox, so we have to resort to
    // absolute positioning
    position: 'absolute',
    bottom: hp('9%'),
    marginLeft: wp('4%')
  },
  largeButtonSecondary: {
    width: wp('91%'),
    height: hp('6%'),
    borderRadius: 4,
    backgroundColor: 'transparent',
    padding: 0
  },
  largeButtonText: {
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Titillium Web',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.43,
    padding: 0
  },
  largeButton: {
    width: wp('92%'),
    height: hp('6%'),
    borderRadius: 4,
    backgroundColor: AppConstants.SQUARE_BUTTON_COLOR,
    padding: 0
  },
  largeButtonMargin: {
    marginLeft: wp('4%'),
    marginRight: wp('4%')
  },
  centeredLinkContainer: {
    position: 'absolute',
    bottom: 0
  },
  centeredLinkText: {
    color: '#8DC84F',
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.34,
    lineHeight: 24,
    textAlign: 'center'
  },
  linkContainer: {
    flex: 1
  },
  linkText: {
    color: '#8DC84F',
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.34,
    lineHeight: 24,
    textAlign: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 0
  },
  passwordLinkContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: wp('4%'),
    paddingVertical: 0
  },
  ndauTotalContainer: {
    ...Platform.select({
      android: {
        marginTop: hp('4%'),
        marginBottom: hp('4%')
      }
    }),
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    maxHeight: hp('8%'),
    padding: 0
  },
  ndauTotalText: {
    color: '#8CC74F',
    fontFamily: 'Titillium Web',
    fontSize: 36,
    fontWeight: '300',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
    shadowOpacity: 0,
    textShadowColor: 'rgba(78, 149, 122, 1)',
    letterSpacing: 0.77,
    lineHeight: 54,
    textAlign: 'center',
    alignSelf: 'flex-start',
    paddingVertical: 0
  },
  ndauLarge: {
    color: '#FFFFFF',
    fontFamily: AppConstants.NDAU_ICON_FONT,
    fontSize: 33,
    letterSpacing: 0.77,
    lineHeight: 66,
    alignSelf: 'flex-start',
    paddingRight: 4,
    paddingVertical: 0
  },
  ndauSmall: {
    color: '#FFFFFF',
    fontFamily: AppConstants.NDAU_ICON_FONT,
    fontSize: 12,
    letterSpacing: 0.51,
    lineHeight: 36
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
  backArrow: {
    ...Platform.select({
      ios: {
        marginTop: hp('1.6%')
      },
      android: {
        marginTop: hp('.8%')
      }
    }),
    marginLeft: wp('4%')
  },
  progressBar: {
    marginTop: hp('2.9%'),
    marginLeft: wp('3%'),
    marginRight: wp('3%')
  },
  labelWithIconContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    ...Platform.select({
      ios: {
        maxHeight: hp('4%')
      },
      android: {
        maxHeight: hp('5%')
      }
    })
  },
  labelText: {
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Open Sans',
    fontSize: 16,
    letterSpacing: 0.34,
    lineHeight: 24,
    marginRight: wp('2%'),
    paddingTop: 0
  },
  labelTextMarginRight: {
    marginLeft: wp('4%')
  },
  checkboxInScrollView: {
    backgroundColor: AppConstants.SQUARE_BUTTON_COLOR,
    borderColor: AppConstants.SQUARE_BUTTON_COLOR,
    marginTop: hp('3%'),
    marginRight: wp('3%'),
    marginBottom: hp('3%'),
    position: 'relative',
    width: 22,
    height: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  radioButton: {
    borderColor: AppConstants.SQUARE_BUTTON_COLOR,
    color: AppConstants.TEXT_COLOR,
    marginRight: wp('4%'),
    marginLeft: wp('4%'),
    paddingTop: hp('1%')
  },
  radioButtonText: {
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: '200',
    letterSpacing: 0.34,
    lineHeight: 24,
    paddingTop: 0
  },
  checkboxLabel: {
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Open Sans',
    fontSize: 16,
    letterSpacing: 0.34,
    lineHeight: 24,
    marginTop: hp('1.6%'),
    marginRight: wp('4%')
  },
  checkbox: {
    backgroundColor: AppConstants.SQUARE_BUTTON_COLOR,
    borderColor: AppConstants.SQUARE_BUTTON_COLOR,
    marginTop: hp('3%'),
    marginRight: wp('3%'),
    marginLeft: wp('4%'),
    position: 'relative',
    width: 22,
    height: 22,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5
  },
  legalText: {
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Open Sans',
    fontSize: 18,
    letterSpacing: 0.39,
    lineHeight: 27
  },
  mainLegalTextHeading: {
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Open Sans',
    fontSize: 20,
    letterSpacing: 0.39,
    lineHeight: 27,
    fontWeight: 'bold'
  },
  legalTextHeading: {
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Open Sans',
    fontSize: 22,
    letterSpacing: 0.39,
    lineHeight: 27
  },
  legalTextBold: {
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Open Sans',
    fontSize: 18,
    letterSpacing: 0.39,
    lineHeight: 27,
    fontWeight: 'bold'
  },
  input: {
    borderRadius: 1,
    borderStyle: 'solid',
    borderColor: '#BDC1CC',
    backgroundColor: '#EDEAEA',
    fontFamily: 'Open Sans',
    fontSize: 16,
    letterSpacing: 0.34,
    lineHeight: 24
  },
  inputBottomMargin: {
    marginBottom: hp('2%')
  },
  inputSideMargins: {
    marginLeft: wp('4%'),
    marginRight: wp('4%')
  },
  inputErrorBorder: {
    borderStyle: 'solid',
    borderColor: AppConstants.ERROR_COLOR,
    borderWidth: 1
  },
  setupContainerBackgroundImage: {
    height: '150%',
    width: '150%',
    bottom: 450,
    right: 80
  },
  opaqueOverlay: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.9
  },
  loginContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    width: wp('100%'),
    height: hp('88%'),
    marginRight: wp('4%'),
    marginTop: hp('5%'),
    marginBottom: hp('6%')
  },
  appContainerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },
  collapsibleTextVerySmallWhite: {
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Open Sans',
    fontSize: 12,
    fontWeight: '300',
    letterSpacing: 0.26,
    lineHeight: 18
  },
  dropdownDetailsTextPanel: {
    marginLeft: wp('4%'),
    marginRight: wp('4%')
  },

  dropdownDetailsTextPanelWithSmallText: {
    marginLeft: wp('4%'),
    marginRight: wp('4%'),
    flexDirection: 'row',
    justifyContent: 'flex-start'
  },
  dropdownCheckmark: {
    marginTop: hp('1.4%'),
    marginRight: wp('3%')
  },
  loginImageView: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  loginImage: {
    width: wp('40%'),
    height: hp('35%')
  },
  collapsiblePanelContainer: {
    backgroundColor: '#293E63',
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0,
    shadowColor: 'rgba(0, 0, 0, 0.5)'
  },
  collapsiblePanelTitleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  collapsiblePanelTitleLeft: {
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
    color: '#8CC74F',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
    shadowOpacity: 0,
    textShadowColor: 'rgba(78,149,122,1)',
    fontSize: 18,
    fontWeight: '300',
    letterSpacing: 0.39,
    lineHeight: 27,
    fontFamily: 'TitilliumWeb-Light',
    textAlign: 'center'
  },
  collapsiblePanelTitleRight: {
    marginTop: hp('1%'),
    marginBottom: hp('1%'),
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Open Sans',
    fontSize: 18,
    letterSpacing: 0.39,
    lineHeight: 27,
    fontFamily: 'TitilliumWeb-Light'
  },
  collapsiblePanelBody: {
    padding: wp('2%'),
    marginLeft: wp('2%'),
    marginRight: wp('2%')
  },
  collapsiblePanelBorder: {
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginLeft: wp('4%'),
    marginRight: wp('4%'),
    opacity: 0.2
  },
  bar: {
    alignItems: 'center',
    alignSelf: 'stretch',
    flexDirection: 'row',
    height: hp('8%'),
    backgroundColor: '#0A1724',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    shadowOpacity: 0,
    shadowColor: 'rgba(0, 0, 0, 0.5)',
    overflow: 'hidden'
  },
  barWrapper: {
    alignSelf: 'stretch'
  },
  icon: {
    padding: 5,
    width: 40
  },
  barTextTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  barTextTitleContainerWithMiddle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: wp('4%'),
    marginRight: wp('4%')
  },
  title: {
    color: AppConstants.TEXT_COLOR,
    flex: 1,
    fontFamily: 'Open Sans',
    fontSize: 16,
    letterSpacing: 0.34,
    lineHeight: 24,
    paddingLeft: wp('4%')
  },
  titleLeft: {
    color: AppConstants.TEXT_COLOR,
    flex: 1,
    fontFamily: 'Open Sans',
    fontSize: 16,
    letterSpacing: 0.34,
    lineHeight: 24,
    paddingRight: wp('1%')
  },
  barBorder: {
    borderBottomColor: '#455B82',
    borderBottomWidth: 1,
    marginBottom: hp('2%')
  },
  collapsibleBarBorder: {
    borderBottomColor: '#455B82',
    borderBottomWidth: 1
  },
  fullBarBorder: {
    borderBottomColor: '#455B82',
    borderBottomWidth: 1,
    marginTop: hp('2%')
  },
  barTitleLeft: {
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Open Sans',
    fontSize: 16,
    fontWeight: '400',
    letterSpacing: 0.39,
    lineHeight: 27,
    fontFamily: 'TitilliumWeb-Light'
  },
  barTitleMiddle: {
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Open Sans',
    fontSize: 16,
    letterSpacing: 0.39,
    lineHeight: 27,
    fontFamily: 'TitilliumWeb-Light'
  },
  barTitleRight: {
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Open Sans',
    fontSize: 16,
    letterSpacing: 0.39,
    lineHeight: 27,
    fontFamily: 'TitilliumWeb-Light'
  },
  progressNumber: {
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Titillium Web',
    fontSize: 22,
    letterSpacing: 0.39,
    lineHeight: 27,
    paddingLeft: wp('1%'),
    paddingRight: wp('1%'),
    ...Platform.select({
      ios: {
        marginTop: hp('.6%')
      }
    }),
    marginRight: wp('4%')
  },
  orBorder: {
    borderBottomColor: '#455B82',
    borderBottomWidth: 1,
    width: wp('40%'),
    height: hp('4%')
  },
  orBorderText: {
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Open Sans',
    fontSize: 20,
    letterSpacing: 0.43,
    marginLeft: wp('2%'),
    marginRight: wp('2%')
  },
  largeBorderButton: {
    width: wp('92%'),
    height: hp('7%'),
    borderColor: AppConstants.SQUARE_BUTTON_COLOR,
    borderStyle: 'solid',
    borderRadius: 4,
    borderWidth: 2,
    backgroundColor: 'transparent',
    marginTop: wp('3%')
  },
  largeBorderButtonText: {
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Titillium Web',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 0.43,
    padding: 0
  },
  orBorderPanel: {
    width: wp('92%'),
    height: hp('8%')
  },
  paragraphText: {
    color: AppConstants.TEXT_COLOR,
    fontFamily: 'Open Sans',
    fontSize: 18,
    letterSpacing: 0.39,
    lineHeight: 27,
    paddingLeft: wp('1%'),
    paddingRight: wp('1%'),
    marginRight: wp('4%'),
    marginLeft: wp('4%')
  },
  fullWidthAndHeight: { width: wp('100%'), height: hp('100%') },
  qrCode: {
    marginTop: hp('14%'),
    alignSelf: 'center'
  }
})
