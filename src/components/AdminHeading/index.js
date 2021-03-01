import React from "react";
import Heading from "../Heading";
import { GridRow, GridColumn } from "../../../src/components/Grid";

const AdminHeading = ({ trustName, subHeading }) => (
  <GridRow>
    <GridColumn width="full">
      <Heading>
        {trustName}
        <span className="nhsuk-caption-l" data-cy="trust-name">
          {subHeading}
          <span className="nhsuk-u-visually-hidden">-</span>
        </span>
      </Heading>
    </GridColumn>
  </GridRow>
);

export default AdminHeading;