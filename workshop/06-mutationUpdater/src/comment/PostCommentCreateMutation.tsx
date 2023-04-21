/* eslint-disable */
// eslint-disable-next-line
import { graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';
import { SelectorStoreUpdater, RecordSourceSelectorProxy } from 'relay-runtime';

// eslint-disable-next-line import/no-unresolved
// eslint-disable-next-line import/no-unresolved

import { PostCommentCreateInput } from './__generated__/PostCommentCreateMutation.graphql';
import { PostCommentComposer_me$key } from './__generated__/PostCommentComposer_me.graphql';
import { connectionUpdater } from '../../../../apps/web/src/relay/mutationUtils';

export const PostCommentCreate = graphql`
  mutation PostCommentCreateMutation($input: PostCommentCreateInput!) {
    PostCommentCreate(input: $input) {
      success
      error
      post {
        commentsCount
      }
      commentEdge {
        node {
          id
          body
          user {
            id
            name
          }
        }
      }
    }
  }
`;

/**
 * TODO
 * finish Post Comment updater
 * the updater should add the new comment edge to the PostComments connection
 */
export const updater =
  (parentId: string): SelectorStoreUpdater =>
  (store: RecordSourceSelectorProxy) => {
    const key = 'PostComments_comments';
    const newEdge = store.getRootField('PostCommentCreate')?.getLinkedRecord('commentEdge');

    connectionUpdater({
      store,
      edge: newEdge!,
      parentId,
      before: true,
      connectionName: key,
    });

    const recordProxy = store.get(parentId);
    const connection = ConnectionHandler.getConnection(recordProxy!, key);

    ConnectionHandler.insertEdgeBefore(connection!, recordProxy!);
    ConnectionHandler.insertEdgeAfter(connection!, recordProxy!);
  };

let tempID = 0;

/**
 * TODO
 * Create an optimistic updater to PostComment mutation
 * the optimistic updater should create a new comment with the correct text and author
 */
export const optimisticUpdater =
  (input: PostCommentCreateInput, me: PostCommentComposer_me$key) =>
  (
    // eslint-disable-next-line
    store: RecordSourceSelectorProxy,
  ) => {
    // eslint-disable-next-line
    const id = 'client:newComment:' + tempID++;
    const node = store.create(id, 'Comment');
    const meProxy = store.get(me.id);

    node.setValue(id, 'id');
    node.setValue(input.body, 'Body');
    node.setLinkedRecord(meProxy!, 'user');

    const newEdge = store.create('client:newComment' + tempID++, 'CommentEdge');
    newEdge.setLinkedRecord(node, 'node');

    const parentProxy = store.get(input.post);
    const conn = ConnectionHandler.getConnection(parentProxy!, 'PostComments_comments');
    ConnectionHandler.insertEdgeBefore(conn!, newEdge);
  };
