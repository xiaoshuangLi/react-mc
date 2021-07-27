import React from 'react';

import { useMode } from './utils/hooks';

const space = ' ';

const Space = (props = {}) => {
  const { children } = props;

  const mode = useMode();

  if (mode) {
    return children;
  }

  return (
    <>
      { space }
      { children }
      { space }
    </>
  );
};

export default Space;
