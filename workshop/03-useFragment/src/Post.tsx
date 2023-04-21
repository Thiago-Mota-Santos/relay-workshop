import React from 'react';
import { Text } from 'rebass';
import { Card } from '@workshop/ui';
import { graphql, useFragment } from 'react-relay';

import { PostListQuery$key } from './__generated__/PostListQuery.graphql';

interface Props {
  query: PostListQuery$key;
}

const Post = ({ query }: Props) => {
  const post = useFragment(
    graphql`
      fragment PostListQuery on Post {
        id
        content
        author {
          name
        }
      }
    `,
    query,
  );

  return (
    <Card mt='10px' flexDirection='column' p='10px'>
      <Text>id:{post.id}</Text>
      <Text>content:{post.content}</Text>
      <Text>Autor:{post?.author?.name}</Text>
    </Card>
  );
};

export default Post;
