import React from "react";
import Heading from "../Heading";
import { GridRow, GridColumn } from "../../../src/components/Grid";

const TrustAdminHeading = ({ trustName, subHeading }) => (
  <GridRow>
    <GridColumn width="two-thirds">
      <Heading>
        <span className="nhsuk-caption-l">
          {trustName}
          <span className="nhsuk-u-visually-hidden">-</span>
        </span>
        {subHeading}
      </Heading>
    </GridColumn>
  </GridRow>
);

export default TrustAdminHeading;
