import React from 'react';
import { Button as UIButton } from '@mui/material';

const Button = ({ children, theme, ...props }) => {
  const outlineConfig =
    theme === 'outlined'
      ? {
          style: { color: 'white' },
          variant: 'outlined',
          color: 'secondary',
        }
      : {};

  const greyConfig =
    theme === 'grey'
      ? {
          color: 'default',
          size: 'small',
        }
      : {};

  return (
    <UIButton
      type='button'
      color='primary'
      variant='contained'
      {...props}
      {...outlineConfig}
      {...greyConfig}
    >
      {children}
    </UIButton>
  );
};

export { Button };
