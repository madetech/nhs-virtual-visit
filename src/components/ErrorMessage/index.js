import React from 'react';

const ErrorMessage = ({ children, id }) => (
  <span id={id} className="nhsuk-error-message">
    <span className="nhsuk-u-visually-hidden">Error:</span> {children}
  </span>
);

export default ErrorMessage;
