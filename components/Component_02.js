/**
 * Copyright (c) 2018-present, Jaime Biernaski.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 **/

import React, { Component } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

import { graphql, compose } from 'react-apollo';

import getGlobalCounterValue from '../graphql/getGlobalCounterValue';
import setGlobalCounterValue from '../graphql/setGlobalCounterValue';

class Component_02 extends Component {
  state = { counter: 0 };

  render() {
    const { globalCounter: { counter } } = this.props;
    return (
      <View>
        <Text style={{ marginTop: 10 }}>*** Component 02 </Text>

        <View style={styles.container}>
          <Text> ..Local State Counter : {this.state.counter} </Text>
          <Button
            title="+"
            onPress={() => this.setState({ counter: this.state.counter + 1 })}
          />
          <Button
            title="-"
            onPress={() => this.setState({ counter: this.state.counter - 1 })}
          />
        </View>

        <View style={styles.container}>
          <Text> Global State Counter : {counter} </Text>
          <Button title="+" onPress={() => this._plusButtonPressed(counter)} />
          <Button title="-" onPress={() => this._minusButtonPressed(counter)} />
        </View>
      </View>
    );
  }

  _plusButtonPressed = counter => {
    this.props.setGlobalCounterValue({
      variables: {
        index: 'counter',
        counter: counter + 1
      }
    });
  };

  _minusButtonPressed = counter => {
    this.props.setGlobalCounterValue({
      variables: {
        index: 'counter',
        counter: counter - 1
      }
    });
  };
}

export default compose(
  //Get value from global State to Props
  graphql(getGlobalCounterValue, {
    props: ({ data: { globalCounter } }) => ({
      globalCounter
    })
  }),
  //Connect to Mutation
  graphql(setGlobalCounterValue, { name: 'setGlobalCounterValue' })
)(Component_02);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center'
  }
});
