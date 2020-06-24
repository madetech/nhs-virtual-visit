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
import Select from "../../src/components/Select";
import Router from "next/router";
import { ADMIN } from "../../src/helpers/userTypes";
import { VIDEO_PROVIDER_OPTIONS } from "../../src/providers/CallIdProvider";

const AddATrust = () => {
  const [errors, setErrors] = useState([]);
  const [name, setName] = useState("");
  const [adminCode, setAdminCode] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [videoProvider, setVideoProvider] = useState("");

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

    const setPasswordError = (errors) => {
      errors.push({
        id: "trust-password-error",
        message: "Enter a password",
      });
    };

    const setPasswordLengthError = (errors) => {
      errors.push({
        id: "trust-password-error",
        message: "Password must be at least 8 characters long",
      });
    };

    const setPasswordConfirmationMismatchError = (errors) => {
      errors.push({
        id: "trust-password-confirmation-error",
        message: "Password confirmation does not match",
      });
    };

    const setPasswordConfirmationError = (errors) => {
      errors.push({
        id: "trust-password-confirmation-error",
        message: "Confirm the password",
      });
    };

    const setVideoProviderError = (errors) => {
      errors.push({
        id: "video-provider-error",
        message: "Select a video provider",
      });
    };

    if (name.length === 0) {
      setNameError(onSubmitErrors);
    }

    if (videoProvider.length === 0) {
      setVideoProviderError(onSubmitErrors);
    }

    if (adminCode.length === 0) {
      setAdminCodeError(onSubmitErrors);
    }

    if (password.length === 0) {
      setPasswordError(onSubmitErrors);
    } else if (password.length < 8) {
      setPasswordLengthError(onSubmitErrors);
    }

    if (passwordConfirmation.length !== 0) {
      if (password !== passwordConfirmation) {
        setPasswordConfirmationMismatchError(onSubmitErrors);
      }
    } else {
      setPasswordConfirmationError(onSubmitErrors);
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
            password,
            videoProvider,
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
      title="Add a trust"
      hasErrors={errors.length != 0}
      renderLogout={true}
      showNavigationBarForType={ADMIN}
      showNavigationBar={true}
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <form onSubmit={onSubmit}>
            <Heading>Add a trust</Heading>
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
              <Label htmlFor="video-provider" className="nhsuk-label--l">
                Which video provider would you like to use?
              </Label>
              <Select
                id="video-provider"
                className="nhsuk-input--width-10 nhsuk-u-width-one-half"
                prompt="Choose a provider"
                options={VIDEO_PROVIDER_OPTIONS}
                onChange={(event) => {
                  setVideoProvider(event.target.value);
                }}
                hasError={hasError("video-provider")}
                errorMessage={errorMessage("video-provider")}
                name="video-provider"
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
              <Label htmlFor="trust-password" className="nhsuk-label--l">
                Create a password
              </Label>
              <Input
                id="trust-password"
                type="password"
                hasError={hasError("trust-password")}
                errorMessage={errorMessage("trust-password")}
                className="nhsuk-u-font-size-32 nhsuk-input--width-10"
                style={{ padding: "16px!important", height: "64px" }}
                onChange={(event) => setPassword(event.target.value)}
                name="trust-password"
                autoComplete="off"
                value={password || ""}
              />
            </FormGroup>
            <FormGroup>
              <Label
                htmlFor="trust-password-confirmation"
                className="nhsuk-label--l"
              >
                Confirm the password
              </Label>
              <Input
                id="trust-password-confirmation"
                type="password"
                hasError={hasError("trust-password-confirmation")}
                errorMessage={errorMessage("trust-password-confirmation")}
                className="nhsuk-u-font-size-32 nhsuk-input--width-10"
                style={{ padding: "16px!important", height: "64px" }}
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
                name="trust-password-confirmation"
                autoComplete="off"
                value={passwordConfirmation || ""}
              />
            </FormGroup>
            <Button className="nhsuk-u-margin-top-5">Add trust</Button>
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
