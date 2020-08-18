import React, { useState } from "react";
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
import propsWithContainer from "../../../src/middleware/propsWithContainer";
import Error from "next/error";
import Form from "../../../src/components/Form";

const Name = ({ callId, error, callPassword }) => {
  const router = useRouter();
  if (error) {
    return <Error />;
  }

  const backLink = (
    <BackLink href={`/visitors/${callId}/start?callPassword=${callPassword}`}>
      Go back
    </BackLink>
  );
  const nameError = "Enter your name";
  const [name, setName] = useState("");
  const [errors, setErrors] = useState([]);

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const onSubmit = async () => {
    const errors = [];

    if (!name) {
      errors.push({
        id: "name-error",
        message: nameError,
      });
    }

    setErrors(errors);

    if (errors.length === 0) {
      await router.push(
        `/visits/[id]?name=${name}&callPassword=${callPassword}`,
        `/visits/${router.query.id}?name=${name}&callPassword=${callPassword}`
      );
      return true;
    }

    return false;
  };

  return (
    <Layout
      title="What is your name? - Attend a virtual visit"
      hasErrors={errors.length != 0}
      backLink={backLink}
      isBookService={false}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />

          <Form onSubmit={onSubmit}>
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
          </Form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  async ({ query, container }) => {
    const { id: callId, callPassword } = query;

    const verifyCallPassword = container.getVerifyCallPassword();

    const { validCallPassword, error } = await verifyCallPassword(
      callId,
      callPassword
    );

    if (!validCallPassword) {
      return { props: { error: "Unauthorized" } };
    }
    console.log("name.js error", error);
    return { props: { callId, error, callPassword } };
  }
);

export default Name;
