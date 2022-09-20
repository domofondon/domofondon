import React, { forwardRef } from 'react';
import ReactCodeInput from 'react-verification-code-input';

import cl from './CodeInput.module.scss';

const CodeInput = forwardRef(({ onChange, onComplete }, ref) => (
  <ReactCodeInput
    className={cl.CodeInput}
    ref={ref}
    fields={6}
    onChange={onChange}
    onComplete={onComplete}
    fieldHeight={40}
    fieldWidth={40}
  />
));

CodeInput.displayName = 'CodeInput';

export { CodeInput };
