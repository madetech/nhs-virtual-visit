import React, { useRef, useEffect } from "react";

const ErrorSummary = ({ errors }) => {
  if (errors.length === 0) {
    return null;
  }

  const thisRef = useRef(null);

  useEffect(() => {
    thisRef.current.focus();
  }, []);

  return (
    <div
      className="nhsuk-error-summary"
      aria-labelledby="error-summary-title"
      role="alert"
      tabIndex="0"
      ref={thisRef}
    >
      <h2 className="nhsuk-error-summary__title" id="error-summary-title">
        There is a problem
      </h2>
      <div className="nhsuk-error-summary__body">
        <ul className="nhsuk-list nhsuk-error-summary__list">
          {errors.map((error) => (
            <li key={error.id}>
              <a href={`#${error.id}`}>{error.message}</a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ErrorSummary;
