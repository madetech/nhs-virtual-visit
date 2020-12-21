import React, { useState } from "react";
import Button from "../Button";
import FormGroup from "../FormGroup";
import Heading from "../Heading";
import Input from "../Input";
import ErrorSummary from "../ErrorSummary";
import Label from "../Label";
import Router from "next/router";
import Select from "../../components/Select";
import Form from "../Form";
import isPresent from "../../helpers/isPresent";

const AddWardForm = ({ errors, setErrors, hospitals, defaultHospitalId }) => {
  const [hospitalId, setHospitalId] = useState(defaultHospitalId);
  const [wardName, setWardName] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [wardCodeConfirmation, setWardCodeConfirmation] = useState("");

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const onSubmit = async () => {
    const onSubmitErrors = [];

    const setWardNameError = (errors) => {
      errors.push({
        id: "ward-name-error",
        message: "Enter a ward name",
      });
    };

    const setHospitalIdError = (errors) => {
      errors.push({
        id: "hospital-id-error",
        message: "Select a hospital",
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
      setWardNameError(onSubmitErrors);
    }
    if (!isPresent(hospitalId)) {
      setHospitalIdError(onSubmitErrors);
    }
    if (!isPresent(wardCode)) {
      setWardCodeError(onSubmitErrors);
    }
    if (isPresent(wardCodeConfirmation)) {
      if (wardCode !== wardCodeConfirmation) {
        setWardCodeConfirmationMismatchError(onSubmitErrors);
      }
    } else {
      setWardCodeConfirmationError(onSubmitErrors);
    }

    if (onSubmitErrors.length === 0) {
      const submitAnswers = async ({ wardName, wardCode }) => {
        let name = wardName;
        let code = wardCode;

        const response = await fetch("/api/create-ward", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
            code,
            hospitalId,
          }),
        });

        const status = response.status;

        if (status == 201) {
          const { wardId } = await response.json();
          Router.push(
            "/trust-admin/wards/[id]/add-success",
            `/trust-admin/wards/${wardId}/add-success`
          );

          return true;
        } else {
          setUniqueWardCodeError(onSubmitErrors);
          setErrors(onSubmitErrors);
        }

        return false;
      };

      return await submitAnswers({ wardName, wardCode });
    }
    setErrors(onSubmitErrors);
  };

  return (
    <>
      <ErrorSummary errors={errors} />
      <Form onSubmit={onSubmit}>
        <Heading>Add a ward</Heading>
        <FormGroup>
          <Label htmlFor="ward-name" className="nhsuk-label--m">
            What is the ward name?
          </Label>
          <Input
            id="ward-name"
            type="text"
            className="nhsuk-u-width-two-thirds"
            hasError={hasError("ward-name")}
            errorMessage={errorMessage("ward-name")}
            onChange={(event) => setWardName(event.target.value)}
            name="ward-name"
            autoComplete="off"
            value={wardName || ""}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="hospital-id" className="nhsuk-label--m">
            What is the hospital name?
          </Label>
          <Select
            id="hospital-id"
            className="nhsuk-input--width-10"
            prompt="Choose a hospital"
            options={hospitals}
            onChange={(event) => {
              setHospitalId(event.target.value);
            }}
            hasError={hasError("hospital-id")}
            errorMessage={errorMessage("hospital-id")}
            defaultValue={defaultHospitalId}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="ward-code" className="nhsuk-label--m">
            Create a ward code
          </Label>
          <Input
            id="ward-code"
            type="text"
            hasError={hasError("ward-code")}
            errorMessage={errorMessage("ward-code")}
            className="nhsuk-input--width-10"
            onChange={(event) => setWardCode(event.target.value)}
            name="ward-code"
            autoComplete="off"
            value={wardCode || ""}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="ward-code-confirmation" className="nhsuk-label--m">
            Confirm the ward code
          </Label>
          <Input
            id="ward-code-confirmation"
            type="text"
            hasError={hasError("ward-code-confirmation")}
            errorMessage={errorMessage("ward-code-confirmation")}
            className="nhsuk-input--width-10"
            onChange={(event) => setWardCodeConfirmation(event.target.value)}
            name="ward-code-confirmation"
            autoComplete="off"
            value={wardCodeConfirmation || ""}
          />
        </FormGroup>
        <Button className="nhsuk-u-margin-top-5">Add ward</Button>
      </Form>
    </>
  );
};

export default AddWardForm;
