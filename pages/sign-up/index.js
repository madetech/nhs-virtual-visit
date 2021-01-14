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
import Select from "../../src/components/Select";
import { hasError, errorMessage } from "../../src/helpers/pageErrorHandler";

const SignUp = ({ organisations, error }) => {
  const [errors, setErrors] = useState([]);
  const [organisationId, setOrganisationId] = useState("");

  if (error) {
    errors.push({
      id: "database error",
      message: error,
    });
  }

  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const verifyEmail = (email) => email.match(/@nhs\.co\.uk/);

  const onSubmit = async () => {
    const onSubmitErrors = [];

    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (!organisationId) {
      onSubmitErrors.push({
        id: "organisation-id-error",
        message: "Pick an organisation from the dropdown",
      });
    }

    if (!email) {
      onSubmitErrors.push({
        id: "email-error",
        message: "Enter an email",
      });
    }

    if (!verifyEmail(email)) {
      onSubmitErrors.push({
        id: "email-error",
        message: "You must have an NHS email to be able to sign up",
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

    if (onSubmitErrors.length === 0) {
      const body = JSON.stringify({ email, password, organisationId });
      const response = await fetch("/api/send-sign-up-email", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body,
      });

      if (response.status === 201) {
        return true;
      } else {
        onSubmitErrors.push({
          id: "email-invalid-error",
          message: "The email you entered was not recognised",
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
              <FormGroup>
                <Label htmlFor="organisation-id">Organisations</Label>
                <Select
                  id="organisation-id"
                  className="nhsuk-input--width-10 nhsuk-u-width-one-half"
                  prompt="Choose an organisation"
                  options={organisations}
                  onChange={(event) => {
                    setOrganisationId(event.target.value);
                  }}
                  hasError={hasError(errors, "organisation-id")}
                  errorMessage={errorMessage(errors, "organisation-id")}
                />
              </FormGroup>
              <Form onSubmit={onSubmit}>
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
                  />
                </FormGroup>
                <Button className="nhsuk-u-margin-top-5" type="submit">
                  Sign Up
                </Button>
              </Form>
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
  const { organisations, error } = await retrieveOrganisations();

  return {
    props: { organisations, error },
  };
});
