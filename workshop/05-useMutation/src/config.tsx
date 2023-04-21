const config = {
  GRAPHQL_URL: process.env.GRAPHQL_URL ?? 'http://localhost:7500/graphql',
  SUBSCRIPTION_URL: process.env.SUBSCRIPTION_URL,
};

export default config;
