import React from "react";
<<<<<<< HEAD
import { GridRow, GridColumn } from "../../src/components/Grid";
import PanelSuccess from "../../src/components/PanelSuccess";
import Layout from "../../src/components/Layout";

const SendEmailSuccess = ({ email }) => (
  <Layout title="Reset Password Link email has been sent">
    <GridRow>
      <GridColumn>
        <PanelSuccess
          name={`Email`}
          action={`sent to ${email}`}
          subAction="Check your email for the link to reset your password"
        />
      </GridColumn>
    </GridRow>
  </Layout>
);

export default SendEmailSuccess;

export const getServerSideProps = ({ query }) => {
  const email = query.email;
  return {
    props: {
      email,
    },
  };
};
=======

const SendEmailSuccess = () => {
  return <div>Email has been sent for reset password</div>;
};

export default SendEmailSuccess;
>>>>>>> chore: refactor token provider for reset password
