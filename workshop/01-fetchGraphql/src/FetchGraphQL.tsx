import config from './config';

export default async function FetchGraphQl<T>(query: string, variables: object = {}): Promise<{ data: T }> {
  const response = await fetch(config.GRAPHQL_URL, {
    method: 'POST',
    headers: {
      accept: 'application/json',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables,
    }),
  });
  const data = response.json();
  return data;
}
