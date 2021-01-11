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

const ResetPassword = ({ email, tokenError }) => {
  const [errors, setErrors] = useState([]);
  if (tokenError) {
    errors.push({
      id: "token-error",
      message: tokenError,
    });
  }

  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

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
          {!tokenError && (
            <>
              <Heading>Reset Password for {email}</Heading>
              <Form onSubmit={onSubmit}>
                <FormGroup>
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    ref={passwordRef}
                    hasError={hasError("password")}
                    errorMessage={errorMessage("password")}
                    className="nhsuk-input--width-20"
                    name="password"
                  />
                </FormGroup>
                <FormGroup>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    ref={confirmPasswordRef}
                    hasError={hasError("confirmPassword")}
                    errorMessage={errorMessage("confirmPassword")}
                    className="nhsuk-input--width-20"
                    name="confirmPassword"
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

    const verifyResetPasswordLink = container.getVerifyResetPasswordLink();
    const { email, error } = await verifyResetPasswordLink(token);

    return {
      props: {
        email,
        tokenError: error,
      },
    };
  }
);
