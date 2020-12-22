import React from "react";
import classnames from "classnames";
import ErrorMessage from "../ErrorMessage";

const DEFAULT_VALUE = "DEFAULT";

const SelectStatus = ({
  id,
  className,
  prompt,
  options,
  hasError,
  errorMessage,
  defaultValue,
  ...props
}) => {
  return (
    <>
      {hasError && errorMessage ? (
        <ErrorMessage id={`${id}-error`}>{errorMessage}</ErrorMessage>
      ) : null}
      <select
        defaultValue={defaultValue || DEFAULT_VALUE}
        id="nhs-dropdown-menu"
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
<<<<<<< HEAD
          <option key={option.name} value={option.name}>

=======
          <option key={option.id} value={option.name}>
>>>>>>> chore: added SelectStatus and used component in EditHospitalForm
            {option.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectStatus;
