import React from "react";
import { GridRow, GridColumn } from "../../src/components/Grid";
import PanelSuccess from "../../src/components/PanelSuccess";
import ActionLink from "../../src/components/ActionLink";
import Layout from "../../src/components/Layout";

const ResetSuccess = () => {
  return (
    <Layout title="Reset Password Success">
      <GridRow>
        <GridColumn width="two-thirds">
          <PanelSuccess name={`Password`} action="reset" />
          <h2>What happens next</h2>
          <ActionLink href={`/login`}>Return to Login page</ActionLink>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export default ResetSuccess;
