import React, { useState, useRef } from "react";
import Button from "../../src/components/Button";
import ErrorSummary from "../../src/components/ErrorSummary";
import FormGroup from "../../src/components/FormGroup";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Hint from "../../src/components/Hint";
import Input from "../../src/components/Input";
import Label from "../../src/components/Label";
import Layout from "../../src/components/Layout";
import Form from "../../src/components/Form";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import { v4 as uuidv4 } from "uuid";
import fetchEndpointWithCorrelationId from "../../src/helpers/fetchEndpointWithCorrelationId";
import { hasError, errorMessage } from "../../src/helpers/pageErrorHandler";

const Login = ({ correlationId }) => {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState([]);
 

  const pinRef = useRef();
 
  const onSubmit = async () => {
    const errors = [];
    const pin = pinRef.current.value;

    if (!code) {
      errors.push({
        id: "code-error",
        message: "The code you entered was not recognised",
      });
    }

    if (!pin) {
      errors.push({
        id: "pin-error",
        message: "A pin is required",
      });
    }

    if (errors.length === 0) {
      const body = JSON.stringify({ code, pin });
      const response = await fetchEndpointWithCorrelationId(
        "POST",
        "/api/session",
        body,
        correlationId
      );

      if (response.status === 201) {
        window.location.href = `/wards/visits`;
        return true;
      } else {
        errors.push({
          id: "verification-error",
          message: "The code or pin you entered was not recognised",
        });
      }
    }

    setErrors(errors);
    return false;
  };

  return (
    <Layout
      title="Log in to book a virtual visit"
      hasErrors={errors.length > 0}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <Heading>Log in to book a virtual visit</Heading>
          <Form onSubmit={onSubmit}>
            <FormGroup>
              <Label htmlFor="code">Ward code</Label>
              <Hint>You&apos;ll have been given a ward code to use.</Hint>
              <Input
                id="code"
                type="text"
                hasError={hasError(errors,"code")}
                errorMessage={errorMessage(errors,"code")}
                className="nhsuk-input--width-10"
                onChange={(event) => setCode(event.target.value)}
                name="code"
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="pin">Ward PIN</Label>
              <Input
                id="pin"
                type="password"
                ref = {pinRef}
                hasError={hasError(errors, "pin")}
                errorMessage={errorMessage(errors, "pin")}
                className="nhsuk-input--width-10"
                name="pin"
                autoComplete="off"
              />
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
    const trustAdminIsAuthenticated = container.getOrganisationAdminIsAuthenticated();
    const trustAdminToken = trustAdminIsAuthenticated(headers.cookie);

    const adminIsAuthenticated = container.getAdminIsAuthenticated();
    const adminToken = adminIsAuthenticated(headers.cookie);

    const correlationId = `${uuidv4()}-ward-login`;

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
