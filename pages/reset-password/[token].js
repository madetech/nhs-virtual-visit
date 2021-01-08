import React, { useEffect, useRef, useState } from "react";
import Button from "../../src/components/Button";
import ErrorSummary from "../../src/components/ErrorSummary";
import FormGroup from "../../src/components/FormGroup";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Input from "../../src/components/Input";
import Label from "../../src/components/Label";
import Layout from "../../src/components/Layout";
import Form from "../../src/components/Form";
import { withRouter } from "next/router";
import jwt from "jsonwebtoken";

const ResetPassword = ({ router }) => {
  const [errors, setErrors] = useState([]);
  const [expirationError, setExpirationError] = useState(false);
  const [email, setEmail] = useState("");
  const passwordRef = useRef();
  const confirmPasswordRef = useRef();

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  useEffect(() => {
    const token = router.query.token;
    if (token) {
      const { emailAddress } = jwt.decode(token);
      setEmail(emailAddress);
    }
    const decryptedToken = jwt.verify(token, process.env.JWT_SIGNING_KEY);
    console.log(decryptedToken);
    if (!decryptedToken) {
      setExpirationError(true);
    }
  }, [router]);

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
        window.location.href = `/reset-password/reset-success`;
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

  const expirationErrorMessage = (
    <div>
      Your link has expired. Please go back to reset password page and request
      another link
    </div>
  );
  return (
    <Layout title="Log in to manage your trust" hasErrors={errors.length > 0}>
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <Heading>Reset Password for {email}</Heading>
          {expirationError ? (
            expirationErrorMessage
          ) : (
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
          )}
        </GridColumn>
        <span style={{ clear: "both", display: "block" }}></span>
      </GridRow>
    </Layout>
  );
};
export default withRouter(ResetPassword);
