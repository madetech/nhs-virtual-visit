import React from "react";

const Text = ({ children, ...others }) => (
  <p className="nhsuk-body" {...others}>
    {children}
  </p>
);

export default Text;
