import React, { useState } from "react";
import Button from "../Button";
import FormGroup from "../FormGroup";
import FormHeading from "../FormHeading";
import Input from "../Input";
import ErrorSummary from "../ErrorSummary";
import Label from "../Label";
import Router from "next/router";
import Form from "../../components/Form";
import isPresent from "../../helpers/isPresent";
import { hasError, errorMessage } from "../../helpers/pageErrorHandler";

const AddWardForm = ({ errors, setErrors, hospital }) => {
  const [wardName, setWardName] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [wardCodeConfirmation, setWardCodeConfirmation] = useState("");
  const [wardPin, setWardPin] = useState("");
  const [wardPinConfirmation, setWardPinConfirmation] = useState("");

  const onSubmit = async () => {
    const onSubmitErrors = [];

    const setWardNameError = (errors) => {
      errors.push({
        id: "ward-name-error",
        message: "Enter a ward name",
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
    const setWardPinError = (errors) => {
      errors.push({
        id: "ward-pin-error",
        message: "Enter a pin code",
      });
    };

    const setWardPinLengthError = (errors) => {
      errors.push({
        id: "ward-pin-length-error",
        message: "Ward pin is only 4 characters",
      });
    };

    const setWardPinConfirmationError = (errors) => {
      errors.push({
        id: "ward-pin-confirmation-error",
        message: "Confirm the ward pin",
      });
    };

    const setWardPinConfirmationMismatchError = (errors) => {
      errors.push({
        id: "ward-pin-confirmation-error",
        message: "Ward pin confirmation does not match",
      });
    };

    if (!isPresent(wardName)) {
      setWardNameError(onSubmitErrors);
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

    if (isPresent(wardPin)) {
      if (wardPin.length > 4) {
        setWardPinLengthError(onSubmitErrors);
      }
    } else {
      setWardPinError(onSubmitErrors);
    }

    if (isPresent(wardPinConfirmation)) {
      if (wardPin !== wardPinConfirmation) {
        setWardPinConfirmationMismatchError(onSubmitErrors);
      }
    } else {
      setWardPinConfirmationError(onSubmitErrors);
    }

    if (onSubmitErrors.length === 0) {
      const submitAnswers = async ({ wardName, wardCode, wardPin }) => {
        let name = wardName;
        let code = wardCode;
        let pin = wardPin;

        const response = await fetch("/api/create-ward", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
            code,
            pin,
            hospitalId: hospital.id,
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

      return await submitAnswers({ wardName, wardCode, wardPin });
    }
    setErrors(onSubmitErrors);
  };

  return (
    <>
      <ErrorSummary errors={errors} />
      <Form onSubmit={onSubmit}>
        <FormHeading>Add a ward</FormHeading>
        <FormGroup>
          <Label htmlFor="ward-name" className="nhsuk-label--m">
            What is the ward name?
          </Label>
          <Input
            id="ward-name"
            type="text"
            className="nhsuk-u-width-two-thirds"
            hasError={hasError(errors, "ward-name")}
            errorMessage={errorMessage(errors, "ward-name")}
            onChange={(event) => setWardName(event.target.value)}
            name="ward-name"
            autoComplete="off"
            value={wardName || ""}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="ward-code" className="nhsuk-label--m">
            Create a ward code
          </Label>
          <Input
            id="ward-code"
            type="text"
            hasError={hasError(errors, "ward-code")}
            errorMessage={errorMessage(errors, "ward-code")}
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
            hasError={hasError(errors, "ward-code-confirmation")}
            errorMessage={errorMessage(errors, "ward-code-confirmation")}
            className="nhsuk-input--width-10"
            onChange={(event) => setWardCodeConfirmation(event.target.value)}
            name="ward-code-confirmation"
            autoComplete="off"
            value={wardCodeConfirmation || ""}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="ward-pin" className="nhsuk-label--m">
            Create a ward pin
          </Label>
          <Input
            id="ward-pin"
            type="text"
            hasError={hasError(errors, "ward-pin")}
            errorMessage={errorMessage(errors, "ward-pin")}
            className="nhsuk-input--width-10"
            onChange={(event) => setWardPin(event.target.value)}
            name="ward-pin"
            autoComplete="off"
            value={wardPin || ""}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="ward-pin-confirmation" className="nhsuk-label--m">
            Confirm the ward pin
          </Label>
          <Input
            id="ward-pin-confirmation"
            type="text"
            hasError={hasError(errors, "ward-pin-confirmation")}
            errorMessage={errorMessage(errors, "ward-pin-confirmation")}
            className="nhsuk-input--width-10"
            onChange={(event) => setWardPinConfirmation(event.target.value)}
            name="ward-pin-confirmation"
            autoComplete="off"
            value={wardPinConfirmation || ""}
          />
        </FormGroup>
        <Button className="nhsuk-u-margin-top-5">Add ward</Button>
      </Form>
    </>
  );
};

export default AddWardForm;
