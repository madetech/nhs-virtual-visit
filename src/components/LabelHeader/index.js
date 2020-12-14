import React from "react";

const LabelHeader = ({ children, ...others }) => (
  <h1 className="nhsuk-label-wrapper">
    <label className="nhsuk-label nhsuk-label--m" {...others}>
      {children}
    </label>
  </h1>
);

export default LabelHeader;
