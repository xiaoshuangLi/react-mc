import { useMemo } from 'react';

import defaultOptions from './options';

export const useOptions = (props = {}) => {
  const { options = {} } = props;

  return useMemo(
    () => ({ ...defaultOptions, ...options }),
    Object.values(options),
  );
};
