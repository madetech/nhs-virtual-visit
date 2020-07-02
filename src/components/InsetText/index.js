import React from "react";
import classnames from "classnames";

const InsetText = ({ className, children }) => (
  <div className={classnames("nhsuk-inset-text", className)}>
    <span className="nhsuk-u-visually-hidden">Information: </span>
    <p>{children}</p>
  </div>
);

export default InsetText;
