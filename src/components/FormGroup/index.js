import React from "react";
import classnames from "classnames";

const FormGroup = ({ className, hasError = false, children }) => (
  <div
    className={classnames(
      {
        "nhsuk-form-group--error": hasError,
      },
      "nhsuk-form-group",
      className
    )}
  >
    {children}
  </div>
);

export default FormGroup;
