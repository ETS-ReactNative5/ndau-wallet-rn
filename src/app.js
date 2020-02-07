/* ----- ---- --- -- -
 * Copyright 2020 The Axiom Foundation. All Rights Reserved.
 *
 * Licensed under the Apache License 2.0 (the "License").  You may not use
 * this file except in compliance with the License.  You can obtain a copy
 * in the file LICENSE in the source distribution or at
 * https://www.apache.org/licenses/LICENSE-2.0.txt
 * - -- --- ---- -----
 */

import React from 'react'
import { YellowBox, View, Text, NativeModules } from 'react-native'
import AppNavigation from './navigation/AppNavigation'
import FlashMessage from 'react-native-flash-message'
import OfflineMessage from './components/common/OfflineMessage'
import BackgroundTasks from './services/BackgroundTasks'
import Styles from './css/styles'
import SettingsStore from './stores/SettingsStore'
import { ThemeProvider } from 'nachos-ui'
import { configureFontAwesomePro } from 'react-native-fontawesome-pro'
// TODO theme provider is not used but appears to be required by some sub component.
// Simply removing it causes an error.

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader'
])
YellowBox.ignoreWarnings(['Class RCTCxxModule'])

configureFontAwesomePro('light')

const { UIManager } = NativeModules
UIManager.setLayoutAnimationEnabledExperimental &&
  UIManager.setLayoutAnimationEnabledExperimental(true)

export default class App extends React.Component {
  constructor (props) {
    super(props)

    BackgroundTasks.initialize()
    this.state = {
      net: ''
    }
    const updater = net => this.setState({ net: net })
    SettingsStore.addListener(updater)
  }

  render () {
    const { net } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: 'black' }}>
        <ThemeProvider>
          {net !== 'mainnet' && net !== '' ? (
            <View style={Styles.networkContainer}>
              <View style={Styles[`${net}BarStyle`]}>
                <Text style={Styles.netBarText}>{net}</Text>
              </View>
            </View>
          ) : null}
          <AppNavigation />
          <FlashMessage position='top' />
          <OfflineMessage />
        </ThemeProvider>
      </View>
    )
  }
}
