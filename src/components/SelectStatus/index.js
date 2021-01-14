import React from "react";
import classnames from "classnames";

const DEFAULT_VALUE = "DEFAULT";

const SelectStatus = ({
  id,
  className,
  prompt,
  options,
  defaultValue,
  ...props
}) => {
  return (
    <>
      <select
        id={id}
        defaultValue={defaultValue || DEFAULT_VALUE}
        data-cy="select-status"
        className={classnames("nhsuk-select", className)}
        {...props}
      >
        <option value="DEFAULT" disabled>
          {prompt}
        </option>
        {options.map((option) => (
          <option key={option.name} value={option.name}>
            {option.name}
          </option>
        ))}
      </select>
    </>
  );
};

export default SelectStatus;
