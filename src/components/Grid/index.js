import React from "react";

const GridRow = ({ children }) => (
  <div className="nhsuk=grid-row">{children}</div>
);

const GridColumn = ({ children, width, ...others }) => (
  <div className={`nhsuk-grid-column-${width}`} {...others}>
    {children}
  </div>
);

export { GridRow, GridColumn };
