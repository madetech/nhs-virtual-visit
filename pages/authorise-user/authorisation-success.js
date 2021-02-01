import React from "react";
import { GridRow, GridColumn } from "../../src/components/Grid";
import PanelSuccess from "../../src/components/PanelSuccess";
import Layout from "../../src/components/Layout";

const AuthorisationSuccess = ({ email }) => {
  let action = `sent to ${email}`;
  let subAction = "";

  return (
    <Layout title="Account Activation Link email has been sent">
      <GridRow>
        <GridColumn>
          <PanelSuccess name={`Email`} action={action} subAction={subAction} />
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export default AuthorisationSuccess;

export const getServerSideProps = ({ query }) => {
  const { email } = query;
  return {
    props: {
      email,
    },
  };
};
