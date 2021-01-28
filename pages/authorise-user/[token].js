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
      onSubmitErrors.push({
        id: "authorisation-error",
        message: "There was a problem authorising this request",
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
    const verifySignUpLink = container.getVerifySignUpLink();
    const { user, error: linkError } = await verifySignUpLink(token);

    if (linkError) {
      return {
        props: {
          email: null,
          organisationName: null,
          error: linkError,
        },
      };
    }

    const updateLinkStatusByHash = container.getUpdateLinkStatusByHash();
    await updateLinkStatusByHash({ hash: user.hash });

    const retrieveOrganisationById = container.getRetrieveOrganisationById();
    const { organisation, error } = await retrieveOrganisationById(
      user.organisation_id
    );

    return {
      props: {
        email: user.email,
        organisationName: !error ? organisation.name : "undefined",
        error: null,
      },
    };
  }
);
