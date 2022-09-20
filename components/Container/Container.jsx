import React from 'react';

import cl from './Container.module.scss';

const Container = ({  className, children }) => {
  const classes = [cl.root];
  if (className) classes.push(className);

  return <div className={classes.join(' ')}>{children}</div>;
};

export { Container };
