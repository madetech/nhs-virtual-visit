import React from "react";
import propsWithContainer from "../../src/middleware/propsWithContainer";
//import ErrorSummary from "../../src/components/ErrorSummary";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import ActionLink from "../../src/components/ActionLink";

const ActivateAccount = ({ email, activationError }) => {
  return (
    <Layout title="Your account has been activated">
      <GridRow>
        <GridColumn>
          {/* <ErrorSummary errors={[activationError]} /> */}
          {!activationError && (
            <>
              <Heading>{`Account has been activated for email address ${email}`}</Heading>
              <ActionLink href={`/login`}>Go to Login page</ActionLink>
            </>
          )}
        </GridColumn>
        <span style={{ clear: "both", display: "block" }}></span>
      </GridRow>
    </Layout>
  );
};
export default ActivateAccount;

export const getServerSideProps = propsWithContainer(
  async ({ query, container }) => {
    // const activationError = null;
    const error = null;
    const token = query.token;
    const verifySignUpLink = container.getVerifySignUpLink();
    const { email, error: linkError } = await verifySignUpLink(token);
    // activationError = activationError || linkError;
    console.log("Get Server Side Props ***********");
    console.log(email);
    console.log(linkError);
    if (!linkError) {
      // go to user database and make status active
      const updateManagerStatus = container.getUpdateManagerStatus();
      const { error: managerError } = await updateManagerStatus({
        email,
        status: 1,
      });
      console.log(managerError);
      // activationError = activationError || managerError;
      // go to organisation database and make status active
      // const updateOrganisation = container.getUpdateOrganisationStatus();
      // const { error: organisationError } = await updateOrganisationStatus({ organisationName, status: 1 });
    }

    return {
      props: {
        email,
        activationError: error,
      },
    };
  }
);
