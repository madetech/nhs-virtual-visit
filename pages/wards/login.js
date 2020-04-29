import React, { useCallback, useState } from "react";
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
import propsWithContainer from "../../src/middleware/propsWithContainer";

const Login = () => {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState([]);

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
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
      } else {
        errors.push({
          id: "code",
          message: "The code you entered was not recognised",
        });
      }
    }

    setErrors(errors);
  });

  return (
    <Layout title="Log in" hasErrors={errors.length > 0}>
      <GridRow>
        <GridColumn width="one-half">
          <ErrorSummary errors={errors} />
          <Heading>Log in</Heading>

          <form onSubmit={onSubmit}>
            <FormGroup>
              <Label htmlFor="name">Ward code</Label>
              <Hint>You'll have been given a ward code to use.</Hint>
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

    const token = userIsAuthenticated(headers.cookie);

    if (token && token.ward) {
      res.writeHead(307, { Location: `/wards/visits` }).end();
    }

    return { props: {} };
  }
);
