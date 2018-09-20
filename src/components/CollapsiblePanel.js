import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableHighlight,
  Animated
} from 'react-native';
import NdauNodeAPIHelper from '../helpers/NdauNodeAPIHelper';

class CollapsiblePanel extends Component {
  constructor(props) {
    super(props);

    this.cardBackgrounds = [
      require('../../img/green-card.png'),
      require('../../img/light-blue-card.png'),
      require('../../img/dark-blue-card.png'),
      require('../../img/green-locked-card.png'),
      require('../../img/light-blue-locked-card.png'),
      require('../../img/dark-blue-locked-card.png'),
      require('../../img/grey-notified-card.png')
    ];

    this.state = {
      expanded: true,
      animation: new Animated.Value(),
      maxHeight: 0,
      minHeight: 0
    };
  }

  toggle() {
    this.setState({
      expanded: !this.state.expanded
    });

    let initialValue = this.state.expanded
        ? this.state.maxHeight + this.state.minHeight
        : this.state.minHeight,
      finalValue = this.state.expanded
        ? this.state.minHeight
        : this.state.maxHeight + this.state.minHeight;

    this.state.animation.setValue(initialValue);
    Animated.spring(this.state.animation, {
      toValue: finalValue
    }).start();
  }

  setMaxHeight = (event) => {
    if (event.nativeEvent.layout.height > this.state.maxHeight) {
      console.debug(`setting maxHeight for first time: ${event.nativeEvent.layout.height}`);
      this.setState({
        maxHeight: event.nativeEvent.layout.height + 12
      });
    }
  };

  setMinHeight = (event) => {
    this.setState({
      minHeight: event.nativeEvent.layout.height
    });
  };

  render() {
    const lockAdder = this.props.lockAdder ? this.props.lockAdder : 0;
    return (
      <Animated.View style={[ styles.container, { height: this.state.animation } ]}>
        <ImageBackground
          source={this.cardBackgrounds[this.props.onNotice ? 6 : this.props.index % 3 + lockAdder]}
          style={{ width: '100%' }}
        >
          <TouchableHighlight
            style={styles.button}
            onPress={this.toggle.bind(this)}
            underlayColor="transparent"
          >
            <View style={styles.titleContainer} onLayout={this.setMinHeight}>
              <Text style={styles.titleLeft}>{this.props.title}</Text>
              {this.props.account ? (
                <Text style={styles.titleRight}>
                  {NdauNodeAPIHelper.accountNdauAmount(this.props.account)} NDU
                </Text>
              ) : null}
            </View>
          </TouchableHighlight>
          <View style={styles.border} />
          <View style={styles.body} onLayout={this.setMaxHeight}>
            {this.props.children}
          </View>
        </ImageBackground>
      </Animated.View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    overflow: 'hidden',
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 0.5
  },
  titleContainer: {
    flexDirection: 'row'
  },
  titleLeft: {
    flex: 1,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    color: '#fff',
    fontSize: 18,
    fontFamily: 'TitilliumWeb-Bold',
    textAlign: 'left'
  },
  titleRight: {
    flex: 1,
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 5,
    color: '#fff',
    fontSize: 18,
    fontFamily: 'TitilliumWeb-Bold',
    textAlign: 'right'
  },
  button: {},
  buttonImage: {
    width: 30,
    height: 25,
    margin: 8,
    backgroundColor: 'transparent'
  },
  body: {
    padding: 10,
    paddingTop: 0
  },
  border: {
    borderBottomColor: 'white',
    borderBottomWidth: 1,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10
  }
});

export default CollapsiblePanel;
