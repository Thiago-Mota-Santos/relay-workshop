import React from 'react';

import { Flex, Text } from 'rebass';
import { Card, Content } from '@workshop/ui';
import { graphql, useLazyLoadQuery } from 'react-relay';

import { AppQuery } from './__generated__/AppQuery.graphql';

const App = () => {
  const result = useLazyLoadQuery<AppQuery>(
    graphql`
      query AppQuery {
        posts(first: 10) {
          edges {
            node {
              id
              content
            }
          }
        }
      }
    `,
    {},
  );

  const { posts } = result;

  return (
    <Content>
      <Flex flexDirection='column'>
        <Text>Posts</Text>
        <Flex flexDirection='column'>
          {posts.edges.map(({ node }) => (
            <Card key={node.id} mt='10px' flexDirection='column' p='10px'>
              <Text>id: {node.id}</Text>
              <Text>content: {node.content}</Text>
            </Card>
          ))}
        </Flex>
      </Flex>
    </Content>
  );
};

export default App;
