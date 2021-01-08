import React from "react";
<<<<<<< HEAD
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
=======

const ResetSuccess = () => {
  return <div>You have successfully reset your password</div>;
>>>>>>> fix: reset password verify token not working
};

export default ResetSuccess;
