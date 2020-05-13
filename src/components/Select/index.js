import React from "react";
import classnames from "classnames";

const Select = ({ className, prompt, options, ...props }) => (
  <select
    defaultValue={"DEFAULT"}
    className={classnames("nhsuk-select", className)}
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
);
export default Select;
