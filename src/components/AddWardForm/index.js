import React, { useState } from "react";
import Button from "../Button";
import FormGroup from "../FormGroup";
import FormHeading from "../FormHeading";
import Input from "../Input";
import ErrorSummary from "../ErrorSummary";
import Label from "../Label";
import HintText from "../Hint";
import Router from "next/router";
import Form from "../../components/Form";
import isPresent from "../../helpers/isPresent";
import { hasError, errorMessage } from "../../helpers/pageErrorHandler";

const AddWardForm = ({ errors, setErrors, hospital }) => {
  const [wardName, setWardName] = useState("");
  const [wardCode, setWardCode] = useState("");
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

    const setCreateWardApiError = (errors, message) => {
      errors.push({
        id: "create-department-api-error",
        message,
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

    if (isPresent(wardPin)) {
      if (wardPin.length != 4) {
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
      const submitAnswers = async ({ wardName: name, wardCode: code, wardPin: pin }) => {
        const completeCode = `${hospital.code}-${code}`;
        const response = await fetch("/api/create-department", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
            code:  completeCode,
            pin,
            facilityId: hospital.id,
          }),
        });

        const status = response.status;

        if (status == 201) {
          const { uuid } = await response.json();
          Router.push({
            pathname: `/trust-admin/hospitals/${hospital.uuid}/wards/${uuid}/add-ward-success`,
            query: { hospitalName: hospital.name },
          });

          return true;
        } else {
          const { error: errorMessage } = await response.json();
          setCreateWardApiError(onSubmitErrors, errorMessage);
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
          <Label htmlFor="ward-code" className="nhsuk-label--m" style={{ marginBottom: "0px" }}>
            Create a ward code
          </Label>
          <HintText>The ward code should be a unique identifier for your ward, and a mixture of letters and numbers, e.g FAX11</HintText>
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
          <HintText>Ward Code: {hospital.code}-{wardCode}</HintText>
        </FormGroup>
        <FormGroup>
          <Label htmlFor="ward-pin" className="nhsuk-label--m" style={{ marginBottom: "0px" }}>
            Create a ward pin
          </Label>
          <HintText>The ward pin should be a 4 digit number, e.g. 0000</HintText>
          <Input
            id="ward-pin"
            type="password"
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
            type="password"
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
