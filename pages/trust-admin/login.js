import React, { useCallback, useState } from "react";
import fetch from "isomorphic-unfetch";
import Button from "../../src/components/Button";
import ErrorSummary from "../../src/components/ErrorSummary";
import FormGroup from "../../src/components/FormGroup";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Input from "../../src/components/Input";
import Label from "../../src/components/Label";
import Layout from "../../src/components/Layout";
import propsWithContainer from "../../src/middleware/propsWithContainer";

const Login = () => {
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const onSubmitErrors = [];

    if (!code) {
      onSubmitErrors.push({
        id: "code-error",
        message: "Enter a trust code",
      });
    }

    if (!password) {
      onSubmitErrors.push({
        id: "password-error",
        message: "Enter a password",
      });
    }

    if (onSubmitErrors.length === 0) {
      const response = await fetch("/api/session", {
        method: "POST",
        body: JSON.stringify({ code, password }),
        headers: {
          "content-type": "application/json",
        },
      });

      if (response.status === 201) {
        window.location.href = `/trust-admin`;
      } else {
        onSubmitErrors.push({
          message: "The code or password you entered was not recognised",
        });
      }
    }

    setErrors(onSubmitErrors);
  });

  return (
    <Layout title="Log in to manage your trust" hasErrors={errors.length > 0}>
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <Heading>Log in to manage your trust</Heading>

          <form onSubmit={onSubmit}>
            <FormGroup>
              <Label htmlFor="code">Trust code</Label>
              <Input
                id="code"
                type="text"
                hasError={hasError("code")}
                errorMessage={errorMessage("code")}
                className="nhsuk-input--width-10"
                onChange={(event) => setCode(event.target.value)}
                name="code"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                hasError={hasError("password")}
                errorMessage={errorMessage("password")}
                className="nhsuk-input--width-10"
                onChange={(event) => setPassword(event.target.value)}
                name="password"
                autocomplete="off"
              />
              <br />
            </FormGroup>
            <Button className="nhsuk-u-margin-top-5" type="submit">
              Log in
            </Button>
          </form>
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

    if (trustAdminToken) {
      res.writeHead(307, { Location: `/trust-admin` }).end();
    } else if (userToken && userToken.ward) {
      res.writeHead(307, { Location: `/wards/visits` }).end();
    } else if (adminToken) {
      res.writeHead(307, { Location: `/admin` }).end();
    }

    return { props: {} };
  }
);
