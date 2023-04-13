import React, { useCallback, useEffect, useState } from 'react';

import { Flex, Text } from 'rebass';
import { Card, Content, Button } from '@workshop/ui';

import FetchGraphQl from './FetchGraphQL';

interface Node {
  id: string;
  content: string;
}

interface Edge {
  node: Node;
}

interface PostQueryResult {
  posts: {
    edges: Edge[];
  };
}

const App = () => {
  const [posts, setPosts] = useState<Node[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const fetchQuery = useCallback(async () => {
    setError(null);

    try {
      const result = await FetchGraphQl<PostQueryResult>(
        `
      query PostQuery{
        posts(first: 10){
          edges{
            node{
              id
              content
            }
          }
        }
      }
      `,
        {},
      );
      setPosts(result.data.posts.edges.map(({ node }) => node));
    } catch (e) {
      setError(e as Error);
    }
  }, [setError, setPosts]);

  useEffect(() => {
    fetchQuery();
  }, [fetchQuery]);

  if (error) {
    return (
      <Content>
        <Text>Error: {error.toString()}</Text>
        <Button mt='10px'>retry</Button>
      </Content>
    );
  }

  return (
    <Content>
      <Flex flexDirection='column'>
        <Text>Posts</Text>
        <Flex flexDirection='column'>
          {posts.map(post => (
            <Card key={post.id} mt='10px' flexDirection='column' p='10px'>
              <Text>id: {post.id}</Text>
              <Text>content: {post.content}</Text>
            </Card>
          ))}
        </Flex>
      </Flex>
      <Button>Prev</Button>
      <Button>Next</Button>
    </Content>
  );
};

export default App;
