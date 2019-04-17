import React from 'react'
import { YellowBox, View } from 'react-native'
import AppNavigation from './navigation/AppNavigation'
import FlashMessage from 'react-native-flash-message'
import OfflineMessage from './components/common/OfflineMessage'
import BackgroundTasks from './services/BackgroundTasks'
import LoggingService from './services/LoggingService'
import { ThemeProvider } from 'nachos-ui'
import AppConstants from './AppConstants'

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader'
])
YellowBox.ignoreWarnings(['Class RCTCxxModule'])

export default class App extends React.Component {
  constructor (props) {
    super(props)

    BackgroundTasks.initialize()
    LoggingService.initialize()
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <ThemeProvider
          theme={{
            Icon: {
              style: {
                icon: {
                  // fontFamily: 'Font Awesome 5 Pro'
                  // fontFamily: 'Ionicons'
                }
              }
            }
          }}
        >
          <AppNavigation />
          <FlashMessage position='top' />
          <OfflineMessage />
        </ThemeProvider>
      </View>
    )
  }
}
