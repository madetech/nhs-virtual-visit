import React, { useRef, useState } from "react";
import Button from "../src/components/Button";
import ErrorSummary from "../src/components/ErrorSummary";
import FormGroup from "../src/components/FormGroup";
import { GridRow, GridColumn } from "../src/components/Grid";
import Heading from "../src/components/Heading";
import Input from "../src/components/Input";
import Label from "../src/components/Label";
import Layout from "../src/components/Layout";
import propsWithContainer from "../src/middleware/propsWithContainer";
import Form from "../src/components/Form";
import fetchEndpointWithCorrelationId from "../src/helpers/fetchEndpointWithCorrelationId";
import { v4 as uuidv4 } from "uuid";
import { hasError, errorMessage } from "../../src/helpers/pageErrorHandler";

const Login = ({ correlationId }) => {
  const [errors, setErrors] = useState([]);

  const emailRef = useRef();
  const passwordRef = useRef();

  const onSubmit = async () => {
    const onSubmitErrors = [];

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

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

    if (onSubmitErrors.length === 0) {
      const body = JSON.stringify({ code: email, password });

      const response = await fetchEndpointWithCorrelationId(
        "POST",
        "/api/session",
        body,
        correlationId
      );

      if (response.status === 201) {
        const { userType } = await response.json();
        // console.log(userType)
        if (userType === "admin") {
          window.location.href = `/admin`;
        } else if (userType === "manager") {
          window.location.href = `/trust-admin`;
        }
        return true;
      } else {
        onSubmitErrors.push({
          id: "email-or-password-error",
          message: "The email or password you entered was not recognised",
        });
      }
    }

    setErrors(onSubmitErrors);

    return false;
  };

  return (
    <Layout title="Log in to manage your site" hasErrors={errors.length > 0}>
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <Heading>Log in to manage your site</Heading>

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
              <br />
            </FormGroup>
            <Button className="nhsuk-u-margin-top-5" type="submit">
              Log in
            </Button>
          </Form>
        </GridColumn>
        <span style={{ clear: "both", display: "block" }}></span>
      </GridRow>
    </Layout>
  );
};

export default Login;

export const getServerSideProps = propsWithContainer(
  async ({ req: { headers }, res, container }) => {
    const userIsAuthenticated = container.getUserIsAuthenticated();
    const userToken = await userIsAuthenticated(headers.cookie);

    const trustAdminIsAuthenticated = container.getTrustAdminIsAuthenticated();
    const trustAdminToken = trustAdminIsAuthenticated(headers.cookie);

    const adminIsAuthenticated = container.getAdminIsAuthenticated();
    const adminToken = adminIsAuthenticated(headers.cookie);

    const correlationId = `${uuidv4()}-admin-login`;

    if (trustAdminToken) {
      res.writeHead(307, { Location: `/trust-admin` }).end();
    } else if (userToken && userToken.ward) {
      res.writeHead(307, { Location: `/wards/visits` }).end();
    } else if (adminToken) {
      res.writeHead(307, { Location: `/admin` }).end();
    }

    return { props: { correlationId } };
  }
);
