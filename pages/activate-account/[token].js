import React from "react";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import ErrorSummary from "../../src/components/ErrorSummary";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import ActionLink from "../../src/components/ActionLink";

const ActivateAccount = ({ email, organisationName, activationError }) => {
  const errors = [];
  if (activationError) {
    errors.push({
      id: "activation-error",
      message: activationError,
    });
  }
  return (
    <Layout title="Your account has been activated">
      <GridRow>
        <GridColumn>
          <ErrorSummary errors={errors} />
          {!activationError && (
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
    const token = query.token;
    const verifySignUpLink = container.getVerifySignUpLink();
    const { user, error: linkError } = await verifySignUpLink(token);

    if (linkError) {
      return {
        props: {
          email: null,
          organisationName: null,
          activationError: linkError,
        },
      };
    }

    const activateManager = container.getActivateManager();
    const {
      user: activatedUser,
      error: activateManagerError,
    } = await activateManager({ userId: user.user_id });

    if (activateManagerError) {
      return {
        props: {
          email: null,
          organisationName: null,
          activationError: "There was an error",
        },
      };
    }

    const organisationId = activatedUser.organisation_id;
    const activateOrganisation = container.getActivateOrganisation();
    const {
      organisation,
      error: organisationError,
    } = await activateOrganisation({ organisationId });

    return {
      props: {
        email: organisationError ? null : activatedUser.email,
        organisationName: organisationError ? null : organisation.name,
        activationError: organisationError ? "There was an error" : null,
      },
    };
  }
);
