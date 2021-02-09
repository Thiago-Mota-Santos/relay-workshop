// eslint-disable-next-line
import { render, fireEvent, wait } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import React from 'react';
import { MockPayloadGenerator } from 'relay-test-utils';

import { usePreloadedQuery, graphql } from 'react-relay/hooks';
import { loadQuery } from '@workshop/relay';

import { Environment } from '../../../../relay';
import PostLikeButton from '../PostLikeButton';

import { withProviders } from '../../../../../test/withProviders';

import { PostLikeButtonSpecQuery } from './__generated__/PostLikeButtonSpecQuery.graphql';

// eslint-disable-next-line
import { getMutationOperationVariables } from '@workshop/test';

export const getRoot = ({ preloadedQuery }) => {
  const UseQueryWrapper = () => {
    const data = usePreloadedQuery<PostLikeButtonSpecQuery>(
      graphql`
        query PostLikeButtonSpecQuery($id: ID!) @relay_test_operation {
          post: node(id: $id) {
            ...PostLikeButton_post
          }
        }
      `,
      preloadedQuery,
    );

    return <PostLikeButton post={data.post} />;
  };

  return withProviders({
    Component: UseQueryWrapper,
  });
};

it('should render post like button and likes count', async () => {
  const PostLikeButtonSpecQuery = require('./__generated__/PostLikeButtonSpecQuery.graphql');

  const postId = 'postId';
  const query = PostLikeButtonSpecQuery;
  const variables = {
    id: postId,
  };

  const customMockResolvers = {
    Post: () => ({
      id: postId,
      likesCount: 10,
      meHasLiked: false,
    }),
  };

  // queue pending operation
  Environment.mock.queuePendingOperation(query, variables);

  // PostDetailQuery
  Environment.mock.queueOperationResolver(operation => MockPayloadGenerator.generate(operation, customMockResolvers));

  const preloadedQuery = loadQuery(
    Environment,
    PostLikeButtonSpecQuery,
    {
      id: postId,
    },
    {
      fetchPolicy: 'store-or-network',
    },
  );

  const Root = getRoot({
    Component: PostLikeButton,
    preloadedQuery,
  });

  // eslint-disable-next-line
  const { debug, getByText, getByTestId } = render(<Root />);

  // debug();

  // it should render likes count
  expect(getByText('10')).toBeTruthy();

  /**
   * TODO
   * get like button
   * click like button
   * wait mutation to be called
   * assert mutation variables
   */
});
