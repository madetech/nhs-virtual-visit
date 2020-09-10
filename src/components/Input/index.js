import React from "react";
import classnames from "classnames";
import ErrorMessage from "../ErrorMessage";

const Input = React.forwardRef(
  ({ id, className, hasError, errorMessage, ...props }, ref) => (
    <>
      {hasError && errorMessage ? (
        <ErrorMessage id={`${id}-error`}>{errorMessage}</ErrorMessage>
      ) : null}
      <input
        id={id}
        className={classnames(
          {
            "nhsuk-input--error": hasError,
          },
          "nhsuk-input",
          className
        )}
        ref={ref}
        {...props}
      />
    </>
  )
);

Input.displayName = "Input";

export default Input;
