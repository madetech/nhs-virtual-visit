import React, { useState, useCallback } from "react";
import ErrorSummary from "../../src/components/ErrorSummary";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Layout from "../../src/components/Layout";
import verifyAdminToken from "../../src/usecases/verifyAdminToken";

import propsWithContainer from "../../src/middleware/propsWithContainer";
import FormGroup from "../../src/components/FormGroup";
import Heading from "../../src/components/Heading";
import Input from "../../src/components/Input";
import Label from "../../src/components/Label";
import Button from "../../src/components/Button";
import Router from "next/router";
import { ADMIN } from "../../src/helpers/userTypes";

const AddATrust = () => {
  const [errors, setErrors] = useState([]);
  const [name, setName] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [adminCodeConfirmation, setAdminCodeConfirmation] = useState("");

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const onSubmitErrors = [];

    const setNameError = (errors) => {
      errors.push({
        id: "trust-name-error",
        message: "Enter a trust name",
      });
    };

    const setAdminCodeUniqueError = (errors, err) => {
      errors.push({
        id: "trust-admin-code-error",
        message: err,
      });
    };

    const setAdminCodeError = (errors) => {
      errors.push({
        id: "trust-admin-code-error",
        message: "Enter a trust admin code",
      });
    };

    const setAdminCodeLengthError = (errors) => {
      errors.push({
        id: "trust-admin-code-error",
        message: "Trust admin code must be at least 8 characters long",
      });
    };

    const setAdminCodeConfirmationMismatchError = (errors) => {
      errors.push({
        id: "trust-admin-code-confirmation-error",
        message: "Trust admin code confirmation does not match",
      });
    };

    const setAdminCodeConfirmationError = (errors) => {
      errors.push({
        id: "trust-admin-code-confirmation-error",
        message: "Confirm the trust admin code",
      });
    };

    if (name.length === 0) {
      setNameError(onSubmitErrors);
    }

    if (adminCode.length === 0) {
      setAdminCodeError(onSubmitErrors);
    } else if (adminCode.length < 8) {
      setAdminCodeLengthError(onSubmitErrors);
    }

    if (adminCodeConfirmation.length !== 0) {
      if (adminCode !== adminCodeConfirmation) {
        setAdminCodeConfirmationMismatchError(onSubmitErrors);
      }
    } else {
      setAdminCodeConfirmationError(onSubmitErrors);
    }

    if (onSubmitErrors.length === 0) {
      const submitAnswers = async (name) => {
        const response = await fetch("/api/create-trust", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
            adminCode,
          }),
        });

        const status = response.status;

        if (status == 201) {
          const { trustId } = await response.json();
          Router.push({
            pathname: "/admin/add-a-trust-success",
            query: { trustId: trustId },
          });
        } else if (status === 409) {
          const { err } = await response.json();
          setAdminCodeUniqueError(onSubmitErrors, err);
        } else {
          onSubmitErrors.push({
            message: "Something went wrong, please try again later.",
          });
          setErrors(onSubmitErrors);
        }
      };

      await submitAnswers(name);
    }
    setErrors(onSubmitErrors);
  });

  return (
    <Layout
      title="Add a Trust"
      hasErrors={errors.length != 0}
      renderLogout={true}
      showNavigationBarForType={ADMIN}
      showNavigationBar={true}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <form onSubmit={onSubmit}>
            <Heading>Add a Trust</Heading>
            <FormGroup>
              <Label htmlFor="trust-name" className="nhsuk-label--l">
                What is the trust name?
              </Label>
              <Input
                id="trust-name"
                type="text"
                hasError={hasError("trust-name")}
                errorMessage={errorMessage("trust-name")}
                className="nhsuk-u-font-size-32 nhsuk-input--width-10"
                style={{ padding: "16px!important", height: "64px" }}
                onChange={(event) => setName(event.target.value)}
                name="trust-name"
                autoComplete="off"
                value={name || ""}
              />
            </FormGroup>
            <FormGroup>
              <Label htmlFor="trust-admin-code" className="nhsuk-label--l">
                Create a trust admin code
              </Label>
              <Input
                id="trust-admin-code"
                type="text"
                hasError={hasError("trust-admin-code")}
                errorMessage={errorMessage("trust-admin-code")}
                className="nhsuk-u-font-size-32 nhsuk-input--width-10"
                style={{ padding: "16px!important", height: "64px" }}
                onChange={(event) => setAdminCode(event.target.value)}
                name="trust-admin-code"
                autoComplete="off"
                value={adminCode || ""}
              />
            </FormGroup>
            <FormGroup>
              <Label
                htmlFor="trust-admin-code-confirmation"
                className="nhsuk-label--l"
              >
                Confirm the trust admin code
              </Label>
              <Input
                id="trust-admin-code-confirmation"
                type="text"
                hasError={hasError("trust-admin-code-confirmation")}
                errorMessage={errorMessage("trust-admin-code-confirmation")}
                className="nhsuk-u-font-size-32 nhsuk-input--width-10"
                style={{ padding: "16px!important", height: "64px" }}
                onChange={(event) =>
                  setAdminCodeConfirmation(event.target.value)
                }
                name="trust-admin-code-confirmation"
                autoComplete="off"
                value={adminCodeConfirmation || ""}
              />
            </FormGroup>
            <Button className="nhsuk-u-margin-top-5">Add Trust</Button>
          </form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = propsWithContainer(
  verifyAdminToken(() => ({ props: {} }))
);

export default AddATrust;
