import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Button,
  ProgressViewIOS,
  Platform,
  ProgressBarAndroid,
  SafeAreaView
} from 'react-native';

class SetupTermsOfService extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount = () => {
    this.props.navigator.setStyle({
      drawUnderTabBar: true,
      tabBarHidden: true
    });
  };

  onPushAnother = () => {
    this.props.navigator.push({
      label: 'SetupEAINode',
      screen: 'ndau.SetupEAINode',
      passProps: {
        encryptionPassword: this.props.encryptionPassword,
        userId: this.props.userId,
        parentStyles: this.props.parentStyles,
        iconsMap: this.props.iconsMap,
        numberOfAccounts: this.props.numberOfAccounts,
        seedPhraseArray: this.props.seedPhraseArray
      },
      navigatorStyle: {
        drawUnderTabBar: true,
        tabBarHidden: true,
        disabledBackGesture: true
      }
    });
  };

  render() {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.container}>
          <ScrollView style={styles.contentContainer}>
            <View>
              <Text style={this.props.parentStyles.wizardText}>Terms of Service</Text>
            </View>
            <View>
              {Platform.OS === 'android' ? (
                <ProgressBarAndroid
                  styleAttr="Horizontal"
                  progress={0.875}
                  style={this.props.parentStyles.progress}
                  indeterminate={false}
                />
              ) : (
                <ProgressViewIOS progress={0.875} style={this.props.parentStyles.progress} />
              )}
            </View>
            <View>
              <Text style={this.props.parentStyles.wizardText}>
                All POTENTIAL ndau holders should acknowledge that while the Target Price may rise
                AS ADOPTION MOVES along the S-curve there is no guarantee that this will happen.
                There is no guarantee that a holder of ndau WILL get any particular minimum price
                upon selling. The Floor Price is not an absolute guaranteed price. There may be
                temporary or permanent liquidity constraints. Further, as the Floor Price is
                dependent on the dynamic value of the Endowment, it will rise and fall accordingly
                to that value and other factors. All POTENTIAL ndau holders should understand that
                features such as the STABILIZATION INCENTIVE BURN (“SIB”) cannot apply to
                off-blockchain transactions. Further, THE ECOSYSTEM ALIGNMENT INCENTIVE (“EAI”)
                should not be confused with an “interest rate” in the legacy financial system. The
                EAI is awarded for behavior that aligns with the purpose of ndau as a long-term
                store of value. Should all ndau holders lock up their ndau for 3 years and be
                awarded 15 percent more ndau per year as a result, this does not increase the value
                of the Endowment proportionally. In fact, it will lower the Floor Price unless the
                Endowment were, coincidentally, to grow by that same amount through its own return
                on investments. Further, the EAI is not offered passively but rather is awarded in
                association with contracting with or directly operating ndau nodes and thus
                increases the value of the whole ecosystem through participatory efforts. No
                contractual guarantees are given directly to ndau holders since all policy and
                features described herein are subject to governance by the BLOCKCHAIN POLICY
                COUNCIL.
              </Text>
              <Text style={this.props.parentStyles.wizardText}>
                THIS DASHBOARD DOES NOT CONSTITUTE A PROSPECTUS OR OFFERING DOCUMENT AND DOES NOT
                AND IS NOT INTENDED TO CONSTITUTE AN OFFER TO SELL, NOR THE SOLICITATION OF ANY
                OFFER TO BUY, AN INVESTMENT, A SECURITY OR A COMMODITY, OR AN OPTION ON OR ANY OTHER
                RIGHT TO ACQUIRE ANY SUCH INVESTMENT, SECURITY OR COMMODITY. THIS DASHBOARD HAS NOT
                BEEN REVIEWED BY, PASSED ON OR SUBMITTED TO ANY U.S. FEDERAL OR STATE AGENCY OR SELF
                REGULATORY ORGANIZATION OR TO ANY OTHER FOREIGN AGENCY OR SELF-REGULATORY
                ORGANIZATION. THIS DASHBOARD DOES NOT CONSTITUTE ADVICE TO PURCHASE ANY NDAU NOR
                SHOULD IT BE RELIED UPON IN CONNECTION WITH ANY CONTRACT OR CONTRIBUTION DECISION.
                THE NDAU TOKENS HAVE NOT BEEN AND WILL NOT BE REGISTERED UNDER THE SECURITIES ACT OF
                1933, AS AMENDED (THE “SECURITIES ACT”), OR ANY OTHER LAW OR REGULATION GOVERNING
                THE OFFERING, SALE OR EXCHANGE OF SECURITIES IN THE UNITED STATES OR ANY OTHER
                JURISDICTION. THE OFFERING OF NDAU TOKENS IS MADE (1) INSIDE THE UNITED STATES TO
                “ACCREDITED INVESTORS” (AS DEFINED IN SECTION 501 OF THE SECURITIES ACT) IN RELIANCE
                ON REGULATION D UNDER THE SECURITIES ACT TO U.S. PERSONS (AS DEFINED IN SECTION 902
                OF REGULATION S UNDER THE SECURITIES ACT) AND (2) OUTSIDE THE UNITED STATES TO
                NON-U.S. PERSONS IN RELIANCE ON REGULATION S. SUBJECT TO CERTAIN LIMITED EXCEPTIONS,
                PERSONS PURCHASING AS U.S. ACCREDITED INVESTORS WILL BE REQUIRED TO MAINTAIN THEIR
                NDAU TOKENS UNTIL THE FIRST ANNIVERSARY OF THE ISSUANCE OF THE NDAU TOKENS. PERSONS
                PURCHASING AS NON-U.S. PERSONS WILL ONLY BE ENTITLED TO RESELL THEIR NDAU TOKENS
                AFTER 90 DAYS FROM THE ISSUANCE DATE TO OTHER NON-U.S. PERSONS IN AN OFFSHORE
                TRANSACTION (AS DEFINED IN RULE 902 OF THE SECURITIES ACT). THIS DASHBOARD CONTAINS
                FORWARD-LOOKING STATEMENTS THAT ARE BASED ON THE BELIEFS OF THE AXIOM FOUNDATION, AS
                WELL AS CERTAIN ASSUMPTIONS MADE BY AND INFORMATION AVAILABLE TO THE AXIOM
                FOUNDATION. THE PROJECT AS ENVISAGED IN THE WHITEPAPER ASSOCIATED WITH THIS
                DASHBOARD IS UNDER DEVELOPMENT AND IS BEING CONSTANTLY UPDATED, INCLUDING BUT NOT
                LIMITED TO KEY GOVERNANCE AND TECHNICAL FEATURES. ACCORDINGLY, IF AND WHEN THE
                PROJECT IS COMPLETED, IT MAY DIFFER SIGNIFICANTLY FROM THE PROJECT SET OUT IN THAT
                WHITEPAPER. NO REPRESENTATION OR WARRANTY IS GIVEN AS TO THE ACHIEVEMENT OR
                REASONABLENESS OF ANY PLANS, FUTURE PROJECTIONS OR PROSPECTS AND NOTHING IN THAT
                WHITEPAPER IS OR SHOULD BE RELIED UPON AS A PROMISE OR REPRESENTATION AS TO THE
                FUTURE. OWNERSHIP OF NDAU WILL CARRY NO RIGHTS, WHETHER EXPRESS OR IMPLIED, OTHER
                THAN A LIMITED POTENTIAL FUTURE RIGHT OR EXPECTATION TO USE NDAU AS SET FORTH IN
                THIS WHITEPAPER AND IN THE DISTRIBUTION TERMS AND CONDITIONS. NDAU ARE NOT INTENDED
                FOR INVESTMENT, SPECULATIVE OR OTHER FINANCIAL PURPOSES. NDAU DO NOT REPRESENT OR
                CONSTITUTE: • ANY OWNERSHIP RIGHT OR STAKE, SHARE, EQUITY, SECURITY, COMMODITY,
                BOND, DEBT INSTRUMENT OR ANY OTHER FINANCIAL INSTRUMENT OR INVESTMENT CARRYING
                EQUIVALENT RIGHTS; • ANY RIGHT TO RECEIVE FUTURE REVENUES, PROFITS, DIVIDENDS,
                INTEREST, SHARES, EQUITIES, SECURITIES OR ANY OTHER FORM OF PARTICIPATION, ECONOMIC
                OR OTHERWISE, OR ANY GOVERNANCE RIGHT IN OR RELATING TO NDAU, OR THE AXIOM
                FOUNDATION; • ANY FORM OF MONEY OR LEGAL TENDER IN ANY JURISDICTION NOR DO THEY
                CONSTITUTE ANY REPRESENTATION OF MONEY (INCLUDING ELECTRONIC MONEY); • THE PROVISION
                OF ANY GOODS OR SERVICES PRIOR TO THE DATE ON WHICH NDAU MAY BE DELIVERED TO
                CONTRIBUTORS; OR • ANY FUTURE RIGHT TO SELL NDAU, OR TRADE NDAU TO OR WITH ANY OTHER
                PARTY. NDAU WILL BE DISTRIBUTED IN ACCORDANCE WITH THE TERMS AND CONDITIONS SET
                FORTH IN THE DISTRIBUTION TERMS AND CONDITIONS, AS PUBLISHED ON NDAU’S WEBSITE FROM
                TIME TO TIME. THE AXIOM FOUNDATION MAY DECIDE IN ITS SOLE DISCRETION, TO ABANDON THE
                NDAU ECOSYSTEM AND TO FOREGO ISSUING ANY ADDITIONAL NDAU. THE AXIOM FOUNDATION
                INTENDS TO OPERATE IN FULL COMPLIANCE WITH APPLICABLE LAWS AND REGULATIONS AND
                OBTAIN THE NECESSARY LICENCES AND APPROVALS AS MAY BE REQUIRED IN ITS OPINION IN KEY
                MARKETS. THIS MEANS THAT THE DEVELOPMENT AND ROLL-OUT OF ALL THE FEATURES OF NDAU AS
                DESCRIBED IN THIS WHITEPAPER ARE NOT GUARANTEED. REGULATORY LICENCES OR APPROVALS
                MAY BE REQUIRED IN A NUMBER OF RELEVANT JURISDICTIONS IN WHICH RELEVANT ACTIVITIES
                MAY TAKE PLACE. IT IS NOT POSSIBLE TO GUARANTEE, AND NO PERSON MAKES ANY ASSURANCES,
                THAT ANY SUCH LICENCES OR APPROVALS WILL BE OBTAINED WITHIN A PARTICULAR TIMEFRAME
                OR AT ALL. THIS MEANS THAT NDAU MAY NOT BE AVAILABLE IN CERTAIN MARKETS, OR AT ALL.
                THIS COULD REQUIRE THE RESTRUCTURING OF THE NDAU ECOSYSTEM OR RESULT ITS
                UNAVAILABILITY IN ALL OR CERTAIN RESPECTS. THE AXIOM FOUNDATION RESERVES THE RIGHT
                TO REVISE THE ASSOCIATED WHITEPAPER FROM TIME TO TIME IN ITS SOLE DISCRETION. ANY
                REVISIONS TO THAT WHITEPAPER WILL BE MADE AVAILABLE ON NDAU’S WEBSITE OR DIRECTLY TO
                KNOWN HOLDERS THROUGH THEIR PROVIDED COMMUNICATION MEANS, IF AVAILABLE. BEFORE A
                POTENTIAL NDAU HOLDER ACQUIRES NDAU TOKENS, THE AXIOM FOUNDATION MAY (IN ITS SOLE
                AND ABSOLUTE DISCRETION) REQUEST THAT SUCH POTENTIAL NDAU HOLDERS PROVIDE CERTAIN
                INFORMATION AND DOCUMENTATION FOR THE PURPOSES OF COMPLYING WITH ANY “KNOW YOUR
                CUSTOMER” ANTI-MONEY LAUNDERING OR SIMILAR OBLIGATIONS TO WHICH THE AXIOM FOUNDATION
                MAY BE SUBJECT; AND DETERMINE THAT IT IS NECESSARY TO OBTAIN CERTAIN OTHER
                INFORMATION ABOUT SUCH POTENTIAL NDAU HOLDER IN ORDER TO COMPLY WITH APPLICABLE LAWS
                AND REGULATIONS IN CONNECTION WITH THE SALE OF NDAU TOKENS. POTENTIAL NDAU HOLDERS
                SHALL BE SUBJECT TO SUCH OTHER DUE DILIGENCE AS THE AXIOM FOUNDATION DEEMS NECESSARY
                OR APPROPRIATE IN ITS SOLE AND ABSOLUTE DISCRETION. FURTHER, THE AXIOM FOUNDATION
                RESERVES THE RIGHT IN ITS SOLE AND ABSOLUTE DISCRETION TO REFUSE TO SELL NDAU TOKENS
                TO ANY POTENTIAL HOLDER.
              </Text>
            </View>
          </ScrollView>
          <View style={styles.footer}>
            <Button color="#4d9678" onPress={this.onPushAnother} title="Next" />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#1c2227'
  },
  container: {
    flex: 1,
    paddingLeft: 10,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    backgroundColor: '#1c2227'
  },
  contentContainer: {
    flex: 1 // pushes the footer to the end of the screen
  },
  footer: {
    justifyContent: 'flex-end'
  },
  progress: {
    paddingTop: 30,
    paddingBottom: 30
  }
});

export default SetupTermsOfService;
