export type ExtractNode<T extends { edges: any } | null> = NonNullable<
  NonNullable<NonNullable<T>['edges'][number]>['node']
>;
