import React, { useRef, useState } from "react";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import Button from "../../src/components/Button";
import ErrorSummary from "../../src/components/ErrorSummary";
import FormGroup from "../../src/components/FormGroup";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Input from "../../src/components/Input";
import Label from "../../src/components/Label";
import Layout from "../../src/components/Layout";
import Form from "../../src/components/Form";
import Router from "next/router";
import { hasError, errorMessage } from "../../src/helpers/pageErrorHandler";

const ResetPassword = ({ email, error }) => {
  const [errors, setErrors] = useState([]);
  if (error) {
    errors.push({
      id: "token-error",
      message: error,
    });
  }

  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const onSubmit = async () => {
    const onSubmitErrors = [];

    const password = passwordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

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
        message: "Password should be 8 characters or more",
      })
    }

    if (onSubmitErrors.length === 0) {
      const body = JSON.stringify({ email, password });
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body,
      });

      if (response.status === 201) {
        Router.push(`/reset-password/reset-success`);
        return true;
      } else {
        onSubmitErrors.push({
          id: "reset-error",
          message: "There was an error resetting your password",
        });
      }
    }
    setErrors(onSubmitErrors);
    return false;
  };

  return (
    <Layout title="Log in to manage your trust" hasErrors={errors.length > 0}>
      <GridRow>
        <GridColumn>
          <ErrorSummary errors={errors} />
          {!error && (
            <>
              <Heading>Reset Password for {email}</Heading>
              <Form onSubmit={onSubmit}>
                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    ref={passwordRef}
                    hasError={hasError(errors, "password")} //{hasError("password")}
                    errorMessage={errorMessage(errors, "password")}
                    className="nhsuk-input--width-20"
                    name="password"
                    data-cy="password-input"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    ref={confirmPasswordRef}
                    hasError={hasError(errors, "confirmPassword")}
                    errorMessage={errorMessage(errors, "confirmPassword")}
                    className="nhsuk-input--width-20"
                    name="confirmPassword"
                    data-cy="confirm-password-input"
                    autoComplete="off"
                  />
                  <br />
                </FormGroup>
                <Button className="nhsuk-u-margin-top-5" type="submit">
                  Reset Password
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
export default ResetPassword;

export const getServerSideProps = propsWithContainer(
  async ({ query, container }) => {
    const token = query.token;

    const verifyTimeSensitiveLink = container.getVerifyTimeSensitiveLink();
    const { user, error: linkError } = await verifyTimeSensitiveLink(token);
    
    if (linkError) {
      return {
        props: {
          email: null,
          error: linkError,
        },
      };
    }

    const updateUserVerificationToVerified = container.getUpdateUserVerificationToVerified();
    const { success, error } = await updateUserVerificationToVerified({
      hash: user.hash 
    });
    
    return {
      props: {
        email: success ? user.email : null,
        error: error,
      },
    };
  }
);
