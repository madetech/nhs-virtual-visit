import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Button from "../../../src/components/Button";
import FormGroup from "../../../src/components/FormGroup";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Heading from "../../../src/components/Heading";
import Hint from "../../../src/components/Hint";
import Input from "../../../src/components/Input";
import Label from "../../../src/components/Label";
import Layout from "../../../src/components/Layout";
import Text from "../../../src/components/Text";
import ErrorSummary from "../../../src/components/ErrorSummary";

const PreJoin = () => {
  const router = useRouter();
  const nameError = "Enter your name";
  const [name, setName] = useState("");
  const [errors, setErrors] = useState([]);

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const errors = [];

    if (!name) {
      errors.push({
        id: "name-error",
        message: nameError,
      });
    }

    setErrors(errors);

    if (errors.length === 0) {
      window.location = `https://meet.jit.si/${router.query.id}`;
    }
  });

  return (
    <Layout title="Join your virtual visitation" hasErrors={errors.length != 0}>
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <Heading>Join your virtual visitation</Heading>
          <Text>
            You're about to join a video call for your virtual visitation.
          </Text>
          <Text>
            Please enter your name below. When you click "Join virtual
            visitation" you will be provided with instructions on how to join
            the call.
          </Text>
          <form onSubmit={onSubmit}>
            <FormGroup>
              <Label htmlFor="name">What is your name?</Label>
              <Hint>This will be displayed on the video call.</Hint>
              <Input
                id="name"
                type="text"
                onChange={(event) => setName(event.target.value)}
                hasError={hasError("name")}
                errorMessage={nameError}
                name="name"
              />
              <Button className="nhsuk-u-margin-top-5">
                Join virtual visitation
              </Button>
            </FormGroup>
          </form>
        </GridColumn>
        <span style={{ clear: "both", display: "block" }}></span>
      </GridRow>
    </Layout>
  );
};

export default PreJoin;
