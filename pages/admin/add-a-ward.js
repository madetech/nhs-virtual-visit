import React, { useCallback, useState } from "react";
import Button from "../../src/components/Button";
import FormGroup from "../../src/components/FormGroup";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Input from "../../src/components/Input";
import Layout from "../../src/components/Layout";
import ErrorSummary from "../../src/components/ErrorSummary";
import verifyAdminToken from "../../src/usecases/verifyAdminToken";
import TokenProvider from "../../src/providers/TokenProvider";
import Label from "../../src/components/Label";
import Router from "next/router";
import propsWithContainer from "../../src/middleware/propsWithContainer";

const isPresent = (input) => {
  if (input.length !== 0) {
    return input;
  }
};

const Home = () => {
  const [hospitalName, setHospitalName] = useState("");
  const [wardName, setWardName] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [wardCodeConfirmation, setWardCodeConfirmation] = useState("");

  const [errors, setErrors] = useState([]);

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((error) => error.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const errors = [];

    const setWardNameError = (errors) => {
      errors.push({
        id: "ward-name-error",
        message: "Enter a ward name",
      });
    };

    const setHospitalNameError = (errors) => {
      errors.push({
        id: "hospital-name-error",
        message: "Enter a hospital name",
      });
    };

    const setWardCodeError = (errors) => {
      errors.push({
        id: "ward-code-error",
        message: "Enter a ward code",
      });
    };

    const setWardCodeConfirmationError = (errors) => {
      errors.push({
        id: "ward-code-confirmation-error",
        message: "Confirm the ward code",
      });
    };

    const setWardCodeConfirmationMismatchError = (errors) => {
      errors.push({
        id: "ward-code-confirmation-error",
        message: "Ward code confirmation does not match",
      });
    };

    const setUniqueWardCodeError = (errors) => {
      errors.push({
        id: "ward-code-error",
        message: "This ward code already exists. Enter a unique ward code",
      });
    };

    if (!isPresent(wardName)) {
      setWardNameError(errors);
    }
    if (!isPresent(hospitalName)) {
      setHospitalNameError(errors);
    }
    if (!isPresent(wardCode)) {
      setWardCodeError(errors);
    }
    if (isPresent(wardCodeConfirmation)) {
      if (wardCode !== wardCodeConfirmation) {
        setWardCodeConfirmationMismatchError(errors);
      }
    } else {
      setWardCodeConfirmationError(errors);
    }

    if (errors.length === 0) {
      const submitAnswers = async ({ wardName, hospitalName, wardCode }) => {
        let name = wardName;
        let code = wardCode;

        const response = await fetch("/api/create-ward", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
            hospitalName,
            code,
          }),
        });

        const status = response.status;

        if (status == 201) {
          Router.push(`/admin`);
        } else {
          setUniqueWardCodeError(errors);
          setErrors(errors);
        }
      };

      await submitAnswers({ wardName, hospitalName, wardCode });
    }
    setErrors(errors);
  });
  return (
    <Layout
      title="Add a ward"
      hasErrors={errors.length != 0}
      renderLogout={true}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <form onSubmit={onSubmit}>
            <Heading>Add a ward</Heading>
            <FormGroup>
              <Label htmlFor="ward-name" className="nhsuk-label--l">
                What is the ward name?
              </Label>
              <Input
                id="ward-name"
                type="text"
                hasError={hasError("ward-name")}
                errorMessage={errorMessage("ward-name")}
                className="nhsuk-u-font-size-32 nhsuk-input--width-10 nhsuk-u-margin-bottom-5"
                style={{ padding: "16px!important", height: "64px" }}
                onChange={(event) => setWardName(event.target.value)}
                name="ward-name"
                autoComplete="off"
                value={wardName || ""}
              />

              <Label htmlFor="hospital-name" className="nhsuk-label--l">
                What is the hospital name?
              </Label>
              <Input
                id="hospital-name"
                type="text"
                hasError={hasError("hospital-name")}
                errorMessage={errorMessage("hospital-name")}
                className="nhsuk-u-font-size-32 nhsuk-input--width-10 nhsuk-u-margin-bottom-5"
                style={{ padding: "16px!important", height: "64px" }}
                onChange={(event) => setHospitalName(event.target.value)}
                name="hospital-name"
                autoComplete="off"
                value={hospitalName || ""}
              />

              <Label htmlFor="ward-code" className="nhsuk-label--l">
                Create a ward code
              </Label>

              <Input
                id="ward-code"
                type="text"
                hasError={hasError("ward-code")}
                errorMessage={errorMessage("ward-code")}
                className="nhsuk-u-font-size-32 nhsuk-input--width-10 nhsuk-u-margin-bottom-5"
                style={{ padding: "16px!important", height: "64px" }}
                onChange={(event) => setWardCode(event.target.value)}
                name="ward-code"
                autoComplete="off"
                value={wardCode || ""}
              />

              <Label
                htmlFor="ward-code-confirmation"
                className="nhsuk-label--l"
              >
                Confirm the ward code
              </Label>

              <Input
                id="ward-code-confirmation"
                type="text"
                hasError={hasError("ward-code-confirmation")}
                errorMessage={errorMessage("ward-code-confirmation")}
                className="nhsuk-u-font-size-32 nhsuk-input--width-10 nhsuk-u-margin-bottom-5"
                style={{ padding: "16px!important", height: "64px" }}
                onChange={(event) =>
                  setWardCodeConfirmation(event.target.value)
                }
                name="ward-code-confirmation"
                autoComplete="off"
                value={wardCodeConfirmation || ""}
              />

              <br></br>
              <Button className="nhsuk-u-margin-top-5">Add ward</Button>
            </FormGroup>
          </form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyAdminToken(
    async () => {
      let props = {};
      return { props };
    },
    {
      tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
    }
  )
);

export default Home;
