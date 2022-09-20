import { useState, useCallback } from 'react';

export const useForceUpdate = () => {
  const [, forceUpdate] = useState();

  return useCallback(() => {
    forceUpdate((s) => !s);
  }, []);
};
