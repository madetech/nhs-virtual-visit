import React from "react";
import classNames from "classnames";

const ReviewDate = ({ beforeDateText = "", date, className }) => (
  <>
    {date && (
      <div className={classNames("nhsuk-review-date", className)}>
        <p className={classNames("nhsuk-body-s", className)}>
          {beforeDateText}
          {date}
        </p>
      </div>
    )}
  </>
);

export default ReviewDate;
