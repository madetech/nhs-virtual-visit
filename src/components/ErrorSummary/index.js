import React from 'react';

const ErrorSummary = ({ children, errors }) => (
  <div className="nhsuk-error-summary" aria-labelledby="error-summary-title" role="alert">
    <h2 className="nhsuk-error-summary__title" id="error-summary-title">
      There is a problem
    </h2>
    <div className="nhsuk-error-summary__body">
      <ul className="nhsuk-list nhsuk-error-summary__list">
        <li>
          <a href="#call-key-contact-form-mobile-number">Enter a UK mobile number</a>
        </li>
      </ul>
    </div>
  </div>
);

export default ErrorSummary;
