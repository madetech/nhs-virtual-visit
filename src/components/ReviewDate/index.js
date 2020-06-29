import React from "react";
import classNames from "classnames";

const ReviewDate = ({ children, className }) => (
  <div className={classNames("nhsuk-review-date", className)}>
    <p className="nhsuk-body-s">{children}</p>
  </div>
);

export default ReviewDate;
