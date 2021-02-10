import React from "react";

const Heading = ({ children }) => (
  <h1 className="nhsuk-heading-xl" data-cy="page-heading">
    {children}
  </h1>
);

export default Heading;
