// eslint-disable-next-line
import { graphql } from 'react-relay';

/**
 * TODO
 * add mutation input and output here
 */

export const PostLikeMutation = graphql`
  mutation PostLikeMutation($input: PostLikeInput!) {
    PostLike(input: $input) {
      success
      error
      post {
        meHasLiked
        likesCount
      }
    }
  }
`;

export const likeOpmisticResponse = post => ({
  PostLike: {
    success: '',
    error: null,
    post: {
      id: post.id,
      meHasLiked: true,
      likesCount: post.likesCount + 1,
    },
  },
});

/**
 * TODO
 * add Post Like optimistic update
 */
