import cl from './Loading.module.scss';

const Loading = ({ className, isBig }) => {
  const classes = [cl.loading];
  if (className) classes.push(className);
  if (isBig) classes.push(cl.big);

  return <div className={classes.join(' ')} />;
};

export { Loading };
