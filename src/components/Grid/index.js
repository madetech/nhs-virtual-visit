import React from 'react';

const GridRow = ({ children }) => (
  <div className="nhsuk=grid-row">
    {children}
  </div>
);

const GridColumn = ({ children, width }) => (
  <div className={`nhsuk-grid-column-${width}`}>
    {children}
  </div>
);

export { GridRow, GridColumn };
