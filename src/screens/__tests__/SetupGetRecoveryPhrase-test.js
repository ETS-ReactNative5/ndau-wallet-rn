import { mount } from 'enzyme';
import React from 'react';
import { StyleSheet } from 'react-native';
import SetupGetRecoveryPhrase from '../SetupGetRecoveryPhrase';

import renderer from 'react-test-renderer';

describe('testing SetupGetRecoveryPhrase...', () => {
  let styles = StyleSheet.create({
    wizardText: {
      color: '#ffffff',
      fontSize: 20
    }
  });
  const navigator = {
    setStyle: () => {},
    toggleNavBar: () => {}
  };

  it('renders correctly', () => {
    const tree = renderer
      .create(<SetupGetRecoveryPhrase parentStyles={styles} navigator={navigator} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
