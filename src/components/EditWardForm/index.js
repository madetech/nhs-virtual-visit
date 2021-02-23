import React, { useState } from "react";
import Button from "../Button";
import FormGroup from "../FormGroup";
import FormHeading from "../FormHeading";
import Input from "../Input";
import ErrorSummary from "../ErrorSummary";
import Label from "../Label";
import Router from "next/router";
import isPresent from "../../helpers/isPresent";
import Form from "../Form";
import { hasError, errorMessage } from "../../helpers/pageErrorHandler";

const EditWardForm = ({ errors, setErrors, hospital, ward }) => {
  const [wardName, setWardName] = useState(ward.name);
  const [wardPin, setWardPin] = useState(ward.pin);
  const [wardPinConfirmation, setWardPinConfirmation] = useState(ward.pin);
  let onSubmitErrors = [];

  const submitAnswers = async () => {
    let payload = {
      uuid: ward.uuid,
      name: wardName,
    }
    if (wardPin !== ward.pin) {
      payload = { ...payload, pin: wardPin }
    }
    try {
      const response = await fetch("/api/update-a-department", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status == 201) {
        const { uuid: wardUuid } = await response.json();
        await Router.push({
          pathname: `/trust-admin/hospitals/${hospital.uuid}/wards/${wardUuid}/edit-ward-success`,
          query: { hospitalName: hospital.name },
        });
        return true;
      } else {
        const { error } = await response.json();
        onSubmitErrors.push({
          id: "ward-update-error",
          message: error,
        });
        setErrors(onSubmitErrors);
      }
    } catch (e) {
      onSubmitErrors.push({
        id: "ward-update-error",
        message: "There was a problem saving your changes",
      });
      setErrors(onSubmitErrors);
    }

    return false;
  };

  const onSubmit = async () => {
    onSubmitErrors = [];
    const setWardNameError = (errors) => {
      errors.push({
        id: "ward-name-error",
        message: "Enter a ward name",
      });
    };

    if (!isPresent(wardName)) {
      setWardNameError(onSubmitErrors);
    }

    if(!wardPin) {
      onSubmitErrors.push({
        id: "ward-pin-error",
        message: "A pin is required",
      })
    } else if (wardPin!== ward.pin && wardPin.length != 4 ) {
      onSubmitErrors.push({
        id: "ward-pin-length-error",
        message: "Ward pin is only 4 characters",
      })
    }

    if (!wardPinConfirmation) {
      onSubmitErrors.push({
        id: "ward-pin-confirmation-error",
        message: "A confirmation pin is required"
      })
    } else if (wardPinConfirmation !== ward.pin && wardPinConfirmation.length != 4 ) {
      onSubmitErrors.push({
        id: "ward-pin-confirmation-length-error",
        message: "Confirmation pin is only 4 characters",
      })
    }

    if (wardPin !== wardPinConfirmation) {
      onSubmitErrors.push({
        id: "ward-pin-mismatch-error",
        message: "Ward pin and pin cofirmation does not match"
      })
    }

    if (onSubmitErrors.length === 0) {
      await submitAnswers();
    }
    setErrors(onSubmitErrors);
  };

  return (
    <>
      <ErrorSummary errors={errors} />
      <Form onSubmit={onSubmit}>
        <FormHeading>Edit a ward</FormHeading>
        <FormGroup>
          <Label htmlFor="ward-name" className="nhsuk-label--m">
            Edit a ward name
          </Label>
          <Input
            id="ward-name"
            type="text"
            hasError={hasError(errors, "ward-name")}
            errorMessage={errorMessage(errors, "ward-name")}
            className="nhsuk-input--width-10"
            onChange={(event) => setWardName(event.target.value)}
            name="ward-name"
            autoComplete="off"
            value={wardName || ""}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="ward-pin" className="nhsuk-label--m">
            Edit a ward pin
          </Label>
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
        <Button data-testid="edit-ward-button" className="nhsuk-u-margin-top-5">
          Edit ward
        </Button>
      </Form>
    </>
  );
};

export default EditWardForm;
