import React from 'react';

import { ExtractionsContext, useUsing } from './utils/hooks';

const { Provider: ExtractionsProvider } = ExtractionsContext;

const Extractions = (props = {}) => {
  const value = useUsing([]);

  return (
    <ExtractionsProvider value={value} {...props} />
  );
};

export default Extractions;
