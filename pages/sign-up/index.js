import React, { useRef, useState } from "react";
import Button from "../../src/components/Button";
import ErrorSummary from "../../src/components/ErrorSummary";
import FormGroup from "../../src/components/FormGroup";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Input from "../../src/components/Input";
import Label from "../../src/components/Label";
import Layout from "../../src/components/Layout";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import Form from "../../src/components/Form";
import AnchorLink from "../../src/components/AnchorLink";
import SearchInput from "../../src/components/SearchInput";
import { hasError, errorMessage } from "../../src/helpers/pageErrorHandler";
import Router from "next/router";

const SignUp = ({ organisations, error }) => {
  const [errors, setErrors] = useState([]);
  const [organisation, setOrganisation] = useState({});

  if (error) {
    errors.push({
      id: "database error",
      message: error,
    });
  }

  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const organisationChangeHandler = (event) => {
    const organisationName = event.target.value;
    const selectedOrganisation = organisations.find(
      org => org.name.toString() === organisationName
    );
    setOrganisation(selectedOrganisation);
  };

  const onSubmit = async () => {
    const onSubmitErrors = [];

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (!organisation.id) {
      onSubmitErrors.push({
        id: "organisation-error",
        message: "Pick an organisation from the dropdown",
      });
    }

    if (!email) {
      onSubmitErrors.push({
        id: "email-error",
        message: "Enter an email",
      });
    }

    if (!password) {
      onSubmitErrors.push({
        id: "password-error",
        message: "Enter a password",
      });
    }

    if (!confirmPassword) {
      onSubmitErrors.push({
        id: "confirm-password-error",
        message: "Confirm password",
      });
    }

    if (password !== confirmPassword) {
      onSubmitErrors.push({
        id: "password-match-error",
        message: "Passwords do not match",
      });
    }

    if (password.length < 8) {
      onSubmitErrors.push({
        id: "validate-password-error",
        message: "Password has to be 8 characters or more",
      });
    }

    if (onSubmitErrors.length === 0) {
      const body = JSON.stringify({
        email,
        password,
        organisation,
      });
      const response = await fetch("/api/send-sign-up-email", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body,
      });

      if (response.status === 201) {
        Router.push({
          pathname: "sign-up/send-sign-up-email-success",
          query: { email, status: organisation.status },
        });
        return true;
      } else {
        const { error } = await response.json();
        onSubmitErrors.push({
          id: "email-invalid-error",
          message: error,
        });
      }
    }

    setErrors(onSubmitErrors);

    return false;
  };

  return (
    <Layout title="Sign up to access your site" hasErrors={errors.length > 0}>
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          {!error && (
            <>
              <Heading>Sign up to access your site</Heading>
              <Form onSubmit={onSubmit}>
                <FormGroup>
                  <Label htmlFor="organisation-id">Organisations</Label>
                  <SearchInput 
                    id="organisation_id"
                    className="nhsuk-input--width-20"
                    options={organisations}
                    hasError={hasError(errors, "organisation")}
                    errorMessage={errorMessage(errors, "organisation")}
                    organisation={organisation}
                    onChange={organisationChangeHandler}
                    data-cy="organisation-input"
                    />  
                  {organisation && organisation.status === 1 && (
                    <p style={{ paddingTop: "10px" }}>
                      This organisation has already been activated. An email will
                      be sent to a current manager to allow you access on form
                      completion.
                    </p>
                  )}
                </FormGroup> 
                <FormGroup>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    ref={emailRef}
                    hasError={hasError(errors, "email")}
                    errorMessage={errorMessage(errors, "email")}
                    className="nhsuk-input--width-20"
                    name="email"
                    data-cy="email-input"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    ref={passwordRef}
                    hasError={hasError(errors, "password")}
                    errorMessage={errorMessage(errors, "password")}
                    className="nhsuk-input--width-20"
                    name="password"
                    autoComplete="off"
                    data-cy="password-input"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    ref={confirmPasswordRef}
                    hasError={hasError(errors, "confirm-password")}
                    errorMessage={errorMessage(errors, "confirm-password")}
                    className="nhsuk-input--width-20"
                    name="confirm-password"
                    autoComplete="off"
                    data-cy="confirm-password-input"
                  />
                </FormGroup>
                <Button className="nhsuk-u-margin-top-2" type="submit">
                  {organisation && organisation.status === 1
                    ? "Send Request"
                    : "Sign Up"}
                </Button>
              </Form>
              <p>
                <AnchorLink href="/login">Back to Login Page</AnchorLink>
              </p>
            </>
          )}
        </GridColumn>
        <span style={{ clear: "both", display: "block" }}></span>
      </GridRow>
    </Layout>
  );
};

export default SignUp;

export const getServerSideProps = propsWithContainer(async ({ container }) => {
  const retrieveOrganisations = container.getRetrieveOrganisations();
  const { organisations, error } = await retrieveOrganisations({});

  return {
    props: { organisations, error },
  };
});
