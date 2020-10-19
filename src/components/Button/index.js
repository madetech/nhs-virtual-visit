import React from "react";
import classnames from "classnames";

const Button = ({
  children,
  className,
  ariaLabel,
  type = "submit",
  ...others
}) => (
  <button
    type={type}
    className={classnames("nhsuk-button", className)}
    aria-label={ariaLabel}
    {...others}
  >
    {children}
  </button>
);

export default Button;
