import React from 'react';
import classnames from 'classnames';

const Button = ({ children, className, type = "submit", ...others }) => (
  <button
    type={type}
    className={classnames("nhsuk-button", className)}
    {...others}
  >
    {children}
  </button>
);

export default Button;
