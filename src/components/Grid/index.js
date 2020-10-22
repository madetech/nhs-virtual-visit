import React from "react";
import classnames from "classnames";

const GridRow = ({ children, className, ...others }) => (
  <div className={classnames("nhsuk-grid-row", className)} {...others}>
    {children}
  </div>
);

const GridColumn = ({ children, className, width, ...others }) => (
  <div
    className={classnames(`nhsuk-grid-column-${width}`, className)}
    {...others}
  >
    {children}
  </div>
);

export { GridRow, GridColumn };
