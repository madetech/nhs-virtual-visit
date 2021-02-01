import React from "react";
import { GridRow, GridColumn } from "../../src/components/Grid";
import PanelSuccess from "../../src/components/PanelSuccess";
import Layout from "../../src/components/Layout";

const SendSignUpEmailSuccess = ({ email, status }) => {
  let action = `sent to ${email}`;
  let subAction = "Check your email for the link to activate your account";

  if (status === "1") {
    action = "sent to a trust manager to authorise access";
    subAction =
      "An email will be sent to you after authorisation to allow account access";
  }

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

export default SendSignUpEmailSuccess;

export const getServerSideProps = ({ query }) => {
  const { email, status } = query;
  return {
    props: {
      email,
      status,
    },
  };
};
