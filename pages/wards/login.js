import React, { useState } from "react";
import fetch from "isomorphic-unfetch";
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

const Login = () => {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState([]);

  const onSubmit = async () => {
    const errors = [];

    if (!code) {
      errors.push({
        id: "code",
        message: "The code you entered was not recognised",
      });
    }

    if (errors.length === 0) {
      const response = await fetch("/api/session", {
        method: "POST",
        body: JSON.stringify({ code }),
        headers: {
          "content-type": "application/json",
        },
      });

      if (response.status === 201) {
        window.location.href = `/wards/visits`;

        return true;
      } else {
        errors.push({
          id: "code",
          message: "The code you entered was not recognised",
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
                hasError={errors[0]}
                errorMessage={errors[0]?.message}
                className="nhsuk-input--width-10"
                onChange={(event) => setCode(event.target.value)}
                name="code"
              />
              <br />
              <Button className="nhsuk-u-margin-top-5" type="submit">
                Log in
              </Button>
            </FormGroup>
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
