import React, { useState, useRef } from "react";
import Layout from "../../src/components/Layout";
import Heading from "../../src/components/Heading";
import ErrorSummary from "../../src/components/ErrorSummary";
import Form from "../../src/components/Form";
import FormGroup from "../../src/components/FormGroup";
import Label from "../../src/components/Label";
import Input from "../../src/components/Input";
import Button from "../../src/components/Button";
import Text from "../../src/components/Text";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Router from "next/router";
import { hasError, errorMessage } from "../../src/helpers/pageErrorHandler";

const ResetPassword = () => {
  const [errors, setErrors] = useState([]);

  const emailRef = useRef();

  const onSubmit = async () => {
    const onSubmitErrors = [];

    const email = emailRef.current.value;

    if (!email) {
      onSubmitErrors.push({
        id: "email-error",
        message: "Enter an email",
      });
    }

    if (onSubmitErrors.length === 0) {
      const body = JSON.stringify({ email });
      const response = await fetch("/api/send-reset-password-email", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body,
      });

      if (response.status === 201) {
        Router.push({
          pathname: "reset-password/send-email-success",
          query: { email },
        });
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
    <Layout title="Reset Password" hasErrors={errors.length > 0}>
      <GridRow>
        <GridColumn>
          <ErrorSummary errors={errors} />
          <Heading>Reset Password</Heading>
          <Text>
            To reset password, type in your email and a link will be sent to
            your email address
          </Text>
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
            <Button className="nhsuk-u-margin-top-5" type="submit">
              Reset Password
            </Button>
          </Form>
        </GridColumn>
        <span style={{ clear: "both", display: "block" }}></span>
      </GridRow>
    </Layout>
  );
};

export default ResetPassword;
