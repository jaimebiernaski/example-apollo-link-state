/**
 * Copyright (c) 2018-present, Jaime Biernaski.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *    Managing App State with Apollo 2.0
 *
 *    This is a simple React Native application built with Expo
 *    that aim's to show the basics about how to manage a global
 *    state of a counter from distinct components using
 *    'apollo-link-state'.
 *
 *  Author:  Jaime Biernaski
 *  Email:   jaime.biernaski@gmail.com
 *  Created: 11 January 2018
 *
 **/

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
//Apollo
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink } from 'apollo-link';
import { withClientState } from 'apollo-link-state';
//GraphQL
import gql from 'graphql-tag';
//Components
import Component_01 from './components/Component_01';
import Component_02 from './components/Component_02';

//Cache definition
const cache = new InMemoryCache();

//Default State Definition
const defaultState = {
  globalCounter: {
    __typename: 'GlobalCounter',
    counter: 0
  }
};

//Client State Definition (cache, defaults and resolvers)
const stateLink = withClientState({
  cache,
  defaults: defaultState,
  resolvers: {
    Mutation: {
      setGlobalCounterValue: (_, { index, counter }, { cache }) => {
        console.log('INSIDE SET_GLOBAL_COUNTER_VALUE:', index, counter);

        // Defining cache query
        const query = gql`
          query {
            globalCounter @client {
              counter
            }
          }
        `;

        // Get current cache value
        const previousState = cache.readQuery({ query });
        console.log('PREVIOUS STATE:', previousState);

        // Updating data
        const data = {
          globalCounter: {
            ...previousState.globalCounter,
            [index]: counter
          }
        };

        console.log('NEW DATA:', data);

        // Write the updated data into cache
        cache.writeData({ query, data });

        return null; //this avoid the message  Missing field [mutationName] in {}
        // https://github.com/apollographql/apollo-link-state/issues/160
      }
    }
  }
});

//Link definition
const link = ApolloLink.from([stateLink /*HttpLink, SubscriptionLink */]);

//Client definition requires link & cache
const client = new ApolloClient({ cache, link });

export default class App extends React.Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <View style={styles.container}>
          <Text style={styles.textStyle}>
            Global Counter with "apollo-link-state"
          </Text>
          <Component_01 />
          <Component_02 />
        </View>
      </ApolloProvider>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginTop: 50
  },
  textStyle: {
    fontWeight: 'bold'
  }
});
