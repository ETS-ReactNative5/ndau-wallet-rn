import React from 'react'
import { YellowBox, View, Text } from 'react-native'
import AppNavigation from './navigation/AppNavigation'
import FlashMessage from 'react-native-flash-message'
import OfflineMessage from './components/common/OfflineMessage'
import BackgroundTasks from './services/BackgroundTasks'
import Styles from './css/styles'
import SettingsStore from './stores/SettingsStore'
import { ThemeProvider } from 'nachos-ui'
// TODO theme provider is not used but appears to be required by some sub component.
// Simply removing it causes an error.

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader'
])
YellowBox.ignoreWarnings(['Class RCTCxxModule'])

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
      <View style={{ flex: 1 }}>
        <ThemeProvider>
          {net !== 'mainnet' && net !== '' ? (
            <Text style={Styles[`${net}BarStyle`]}>{net}</Text>
          ) : null}
          <AppNavigation />
          <FlashMessage position='top' />
          <OfflineMessage />
        </ThemeProvider>
      </View>
    )
  }
}
