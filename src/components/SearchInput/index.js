import React from "react";
import classnames from "classnames";
import ErrorMessage from "../ErrorMessage";

const SearchInput = ({
  id,
  className,
  options,
  hasError,
  errorMessage,
  organisation,
  ...props
}) => {
  return (
    <>
      {hasError && errorMessage ? (
        <ErrorMessage id={`${id}-error`}>{errorMessage}</ErrorMessage>
      ) : null }
      <input 
        type="text"
        list="options"
        id="nhs-dropdown-menu"
        className={classnames(
          { "nhsuk-select--error": hasError },
          "nhsuk-input",
          className
        )}
        value={organisation?.name}
        { ...props }
      />
      <datalist id="options">
        {options.map(option => (
          <option
            key={option.id}
            valud={option.id}
          >
            {option.name}
          </option>
        ))}
      </datalist>
    </>
  )
};

export default SearchInput;
