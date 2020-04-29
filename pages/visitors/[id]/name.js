import React, { useCallback, useState } from "react";
import { useRouter } from "next/router";
import Button from "../../../src/components/Button";
import FormGroup from "../../../src/components/FormGroup";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import Hint from "../../../src/components/Hint";
import Input from "../../../src/components/Input";
import Layout from "../../../src/components/Layout";
import LabelHeader from "../../../src/components/LabelHeader";
import Text from "../../../src/components/Text";
import BackLink from "../../../src/components/BackLink";
import ErrorSummary from "../../../src/components/ErrorSummary";

const Name = () => {
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
      router.push(`/visits/${router.query.id}?name=${name}`);
    }
  });

  return (
    <Layout
      title="What is your name? - Attend a virtual visit"
      hasErrors={errors.length != 0}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <BackLink href={`/visitors/${router.query.id}/start`}>
            Go back
          </BackLink>

          <ErrorSummary errors={errors} />

          <form onSubmit={onSubmit}>
            <FormGroup>
              <LabelHeader
                htmlFor="name"
                className="nhsuk-label nhsuk-label--xl"
              >
                <span className="nhsuk-caption-l">
                  Attend a virtual visit
                  <span className="nhsuk-u-visually-hidden">-</span>
                </span>
                What is your name?
              </LabelHeader>

              <Hint>This will be displayed on the video call.</Hint>

              <Input
                id="name"
                type="text"
                onChange={(event) => setName(event.target.value)}
                hasError={hasError("name")}
                errorMessage={nameError}
                name="name"
              />

              <Text className="nhsuk-body nhsuk-u-margin-top-4">
                You may be required to download an app. This will depend on your
                device and software installed on it. If this is the case, then
                instructions will be provided.
              </Text>

              <Button>Attend visit</Button>
            </FormGroup>
          </form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export default Name;
