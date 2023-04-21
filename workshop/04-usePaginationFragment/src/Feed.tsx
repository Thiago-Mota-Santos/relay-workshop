import React, { useCallback } from 'react';

import { Flex } from 'rebass';
import { Button } from '@workshop/ui';

import { graphql, usePaginationFragment } from 'react-relay';

import InfiniteScroll from 'react-infinite-scroller';

import Post from './Post';

import { Feed_query$key } from './__generated__/Feed_query.graphql';

import Loading from './Loading';
import { FeedPaginationQuery } from './__generated__/FeedPaginationQuery.graphql';

type Props = {
  query: Feed_query$key;
};
// eslint-disable-next-line
const Feed = ({ query }: Props) => {
  const { data, loadNext, isLoadingNext } = usePaginationFragment<FeedPaginationQuery, Feed_query$key>(
    graphql`
      fragment Feed_query on Query
      @argumentDefinitions(first: { type: Int, defaultValue: 1 }, after: { type: String })
      @refetchable(queryName: "FeedPaginationQuery") {
        posts(first: $first, after: $after) @connection(key: "Feed_posts", filters: []) {
          edges {
            node {
              id
              ...Post_post
            }
          }
          pageInfo {
            hasPreviousPage
            hasNextPage
            startCursor
            endCursor
          }
        }
      }
    `,
    query,
  );

  const { posts } = data;

  /**
   * TODO
   * fix loadMore callback to loadMore posts
   */
  const loadMore = useCallback(() => {
    if (isLoadingNext) {
      return;
    }
    loadNext(1);
  }, [loadNext]);

  return (
    <Flex flexDirection='column'>
      <InfiniteScroll
        pageStart={0}
        loadMore={loadMore}
        hasMore={posts.pageInfo.hasNextPage}
        loader={<Loading />}
        useWindow
      >
        {posts.edges.map(({ node }) => (
          <Post key={node.id} post={node} />
        ))}
        <Button mt='10px' onClick={loadMore}>
          Load More
        </Button>
      </InfiniteScroll>
    </Flex>
  );
};

export default Feed;
