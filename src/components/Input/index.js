import React from "react";
import classnames from "classnames";
import ErrorMessage from "../ErrorMessage";

const Input = ({ id, className, hasError, errorMessage, ...props }) => (
  <>
    {hasError && errorMessage ? (
      <ErrorMessage id={`${id}-error`}>{errorMessage}</ErrorMessage>
    ) : null}
    <input
      className={classnames(
        {
          "nhsuk-input--error": hasError,
        },
        "nhsuk-input",
        className
      )}
      {...props}
    />
  </>
);

export default Input;
