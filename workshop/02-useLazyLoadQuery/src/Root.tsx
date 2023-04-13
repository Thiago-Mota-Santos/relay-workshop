import React, { Suspense } from 'react';

import Providers from './Providers';
import App from './App';
import Loading from './Loading';

const Root = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Providers>
        <App />
      </Providers>
    </Suspense>
  );
};

export default Root;
