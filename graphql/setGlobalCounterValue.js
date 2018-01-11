/**
 * Copyright (c) 2018-present, Jaime Biernaski.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 **/

import gql from 'graphql-tag';

export default gql`
  mutation SetGlobalCounterValue($index: String!, $counter: Number!) {
    setGlobalCounterValue(index: $index, counter: $counter) @client {
      counter
    }
  }
`;
