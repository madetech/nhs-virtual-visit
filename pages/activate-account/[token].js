import React from "react";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import ErrorSummary from "../../src/components/ErrorSummary";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import ActionLink from "../../src/components/ActionLink";

const ActivateAccount = ({ email, organisationName, error }) => {
  const errors = [];
  if (error) {
    errors.push({
      id: "activation-error",
      message: error,
    });
  }
  return (
    <Layout title="Your account has been activated">
      <GridRow>
        <GridColumn>
          <ErrorSummary errors={errors} />
          {!error && (
            <>
              <Heading>Account Activation Success</Heading>
              <p>{`${organisationName} is now active`}</p>
              <p>{`Account has been activated for email address ${email}`}</p>
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
    console.log("***********************");
    console.log("query", query);
    const token = query.token;
    const verifySignUpLink = container.getVerifySignUpLink();
    const { user, error: linkError } = await verifySignUpLink(token);
    console.log("user", user);
    console.log("linkError", linkError);
    if (linkError) {
      return {
        props: {
          email: null,
          organisationName: null,
          error: linkError,
        },
      };
    }

    const activateManagerAndOrganisation = container.getActivateManagerAndOrganisation();
    const {
      organisation,
      error: activationError,
    } = await activateManagerAndOrganisation({
      userId: user.user_id,
      organisationId: user.organisation_id,
    });

    return {
      props: {
        email: !activationError ? user.email : null,
        organisationName: !activationError ? organisation.name : null,
        error: activationError && "There was an error",
      },
    };
  }
);
