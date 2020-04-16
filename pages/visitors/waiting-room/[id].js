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
import Lead from "../../../src/components/Lead";
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
      router.push(`/visitations/${router.query.id}?name=${name}`);
    }
  });

  return (
    <Layout title="Join a video call" hasErrors={errors.length != 0}>
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <Heading>Join a video call</Heading>
          <Lead>You are about to be connected to a video call.</Lead>
          <form onSubmit={onSubmit}>
            <FormGroup>
              <Label htmlFor="name">Your name</Label>
              <Hint>We'll show this to everyone in the call.</Hint>
              <Input
                id="name"
                type="text"
                onChange={(event) => setName(event.target.value)}
                hasError={hasError("name")}
                errorMessage={nameError}
                name="name"
              />
              <Button className="nhsuk-u-margin-top-5">Join video call</Button>
            </FormGroup>
          </form>
        </GridColumn>
        <span style={{ clear: "both", display: "block" }}></span>
      </GridRow>
    </Layout>
  );
};

export default PreJoin;
