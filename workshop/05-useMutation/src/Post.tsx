import React, { useCallback } from 'react';
import { useFragment, useMutation, graphql } from 'react-relay';
import { Text } from 'rebass';
import { Card, CardActions, theme } from '@workshop/ui';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import IconButton from '@mui/material/IconButton';

import { Post_post$key } from './__generated__/Post_post.graphql';
import { likeOpmisticResponse, PostLikeMutation } from './PostLikeMutation';
import { PostUnlikeMutation, UnlikeOptimisticResponse } from './PostUnlikeMutation';

type Props = {
  post: Post_post$key;
};
const Post = (props: Props) => {
  const post = useFragment<Post_post$key>(
    graphql`
      fragment Post_post on Post {
        id
        content
        author {
          name
        }
        meHasLiked
        likesCount
      }
    `,
    props.post,
  );

  /**
   * TODO
   * useMutation from @workshop/relay
   */

  const [postLike] = useMutation(PostLikeMutation);
  const [postUnLike] = useMutation(PostUnlikeMutation);

  const Icon = post.meHasLiked ? FavoriteIcon : FavoriteBorderIcon;

  const handleLike = useCallback(() => {
    // eslint-disable-next-line
    const config = {
      variables: {
        input: {
          post: post.id,
        },
      },
      optimisticResponse: post.meHasLiked ? UnlikeOptimisticResponse(post) : likeOpmisticResponse(post),
    };

    const mutation = post.meHasLiked ? postUnLike : postLike;
    mutation(config);
  }, [post]);

  return (
    <Card mt='10px' flexDirection='column' p='10px'>
      <Text>id: {post.id}</Text>
      <Text>content: {post.content}</Text>
      <Text>Author: {post?.author?.name}</Text>
      <CardActions>
        <IconButton onClick={handleLike}>
          <Icon style={{ color: theme.relayDark }} />
        </IconButton>
        {post.likesCount > 0 ? <Text>{post.likesCount}</Text> : null}
      </CardActions>
    </Card>
  );
};

export default Post;
