import React from 'react';
import classnames from 'classnames';

const Input = ({ className, ...props }) => (
  <input className={classnames("nhsuk-input", className)} {...props} />
);

export default Input;
