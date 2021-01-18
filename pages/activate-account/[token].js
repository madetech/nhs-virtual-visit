import React from "react";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import ErrorSummary from "../../src/components/ErrorSummary";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import ActionLink from "../../src/components/ActionLink";

const ActivateAccount = ({ email, activationError }) => {
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
    let email;
    let activationError = null;
    const token = query.token;
    const verifySignUpLink = container.getVerifySignUpLink();
    const { id, error: linkError } = await verifySignUpLink(token);
    console.log("*****Verify sign up link iid");
    console.log(id);
    if (!linkError) {
      const updateManagerStatus = container.getUpdateManagerStatus();
      const { user, error: managerError } = await updateManagerStatus({
        id,
        status: 1,
      });

      email = user.email;
      const organisationId = user.organisation_id;

      const updateOrganisationStatus = container.getUpdateOrganisationStatus();
      const { error: organisationError } = await updateOrganisationStatus({
        organisationId,
        status: 1,
      });

      // if (!organisationError) {
      //   const updateVerifiedInUserVerificationTable = container.getUpdateVerifiedInUserVerificationTable();
      //   const { error: userVerificationTableError } = await updateVerifiedInUserVerificationTable({ verified: 1 });
      // }
      activationError = managerError || organisationError;
    }

    return {
      props: {
        email,
        activationError: activationError || linkError,
      },
    };
  }
);
