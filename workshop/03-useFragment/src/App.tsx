import React from 'react';

import { Flex, Text } from 'rebass';
import { Content, Card } from '@workshop/ui';

import { useLazyLoadQuery, graphql } from 'react-relay';

import { AppQuery } from './__generated__/AppQuery.graphql';
import Post from './Post';

const App = () => {
  const query = useLazyLoadQuery<AppQuery>(
    graphql`
      query AppQuery {
        posts(first: 10) {
          edges {
            node {
              id
              ...PostListQuery
            }
          }
        }
      }
    `,
    {},
    {
      fetchPolicy: 'network-only',
    },
  );

  const { posts } = query;

  return (
    <Content>
      <Flex flexDirection='column'>
        <Text>Posts</Text>
        <Flex flexDirection='column'>
          {posts.edges.map(({ node }) => (
            <Card mt='10px' flexDirection='column' p='10px' key={node.id}>
              <Post query={node} key={node.id} />
            </Card>
          ))}
        </Flex>
      </Flex>
    </Content>
  );
};

export default App;
