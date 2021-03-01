import React, { useState } from "react";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import ErrorSummary from "../../src/components/ErrorSummary";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Layout from "../../src/components/Layout";
import Button from "../../src/components/Button";
import Router from "next/router";

const AuthoriseUser = ({ email, organisationName, error }) => {
  const [errors, setErrors] = useState([]);

  if (error) {
    errors.push({
      id: "authorisation-error",
      message: error,
    });
  }

  const clickHandler = async () => {
    const onSubmitErrors = [];

    const body = JSON.stringify({
      email,
    });
    const response = await fetch("/api/send-activation-email", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body,
    });

    if (response.status === 201) {
      Router.push({
        pathname: "/authorise-user/authorisation-success",
        query: { email },
      });
      return true;
    } else {
      const { err } = await response.json(); 
      onSubmitErrors.push({
        id: "authorisation-error",
        message: err,
      });
    }

    setErrors(onSubmitErrors);
    return false;
  };

  return (
    <Layout title="Authorise account">
      <GridRow>
        <GridColumn>
          <ErrorSummary errors={errors} />
          {!error && (
            <>
              <Heading>Authorise Account</Heading>
              <p>{`${email} has requested an account for ${organisationName}`}</p>
              <p>Please click the button below to authorise this request</p>
              <Button
                className="nhsuk-u-margin-top-5"
                type="submit"
                onClick={clickHandler}
              >
                Authorise
              </Button>
            </>
          )}
        </GridColumn>
        <span style={{ clear: "both", display: "block" }}></span>
      </GridRow>
    </Layout>
  );
};
export default AuthoriseUser;

export const getServerSideProps = propsWithContainer(
  async ({ query, container }) => {
    const token = query.token;
    const verifyTimeSensitiveLink = container.getVerifyTimeSensitiveLink();
    const { user, error: linkError } = await verifyTimeSensitiveLink(token);

    if (linkError) {
      return {
        props: {
          email: null,
          organisationName: null,
          error: linkError,
        },
      };
    }

    const updateUserVerificationToVerified = container.getUpdateUserVerificationToVerified();
    await updateUserVerificationToVerified({ hash: user.hash });

    const retrieveOrganisationById = container.getRetrieveOrganisationById();
    const { organisation } = await retrieveOrganisationById(
      user.organisation_id
    );

    return {
      props: {
        email: user.email,
        organisationName: organisation?.name,
        error: null,
      },
    };
  }
);
