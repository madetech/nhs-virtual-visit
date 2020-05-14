import React from "react";
import classnames from "classnames";
import ErrorMessage from "../ErrorMessage";

const Select = ({
  id,
  className,
  prompt,
  options,
  hasError,
  errorMessage,
  ...props
}) => (
  <>
    {hasError && errorMessage ? (
      <ErrorMessage id={`${id}-error`}>{errorMessage}</ErrorMessage>
    ) : null}
    <select
      defaultValue={"DEFAULT"}
      className={classnames(
        {
          "nhsuk-select--error": hasError,
        },
        "nhsuk-select",
        className
      )}
      {...props}
    >
      <option value="DEFAULT" disabled>
        {prompt}
      </option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  </>
);
export default Select;
