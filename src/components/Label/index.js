import React from "react";

const Label = ({ children, ...others }) => (
  <label className="nhsuk-label" {...others}>
    {children}
  </label>
);

export default Label;
