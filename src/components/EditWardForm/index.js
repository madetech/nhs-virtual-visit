import React, { useState } from "react";
import Button from "../Button";
import FormGroup from "../FormGroup";
import FormHeading from "../FormHeading";
import Input from "../Input";
import ErrorSummary from "../ErrorSummary";
import SelectStatus from "../SelectStatus";
import Label from "../Label";
import Router from "next/router";
import isPresent from "../../helpers/isPresent";
import Form from "../Form";
import { hasError, errorMessage } from "../../helpers/pageErrorHandler";

const EditWardForm = ({ errors, setErrors, hospitalUuid, ward }) => {
  const [wardName, setWardName] = useState(ward.name);
  const [wardStatus, setWardStatus] = useState(ward.status);
  let onSubmitErrors = [];

  const submitAnswers = async () => {
    try {
      const response = await fetch("/api/update-a-department", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          uuid: ward.uuid,
          name: wardName,
          status: wardStatus,
        }),
      });

      if (response.status == 201) {
        const { uuid: wardUuid } = await response.json();
        await Router.push(
          // "/trust-admin/hospitals/[hospitalUuid]/wards/[wardUuid]/edit-ward-success",
          `/trust-admin/hospitals/${hospitalUuid}/wards/${wardUuid}/edit-ward-success`
        );
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
            What is the ward name?
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
          <Label htmlFor="ward-status" className="nhsuk-label--m">
            Ward Status
          </Label>
          <SelectStatus
            id="ward-status"
            className="nhsuk-input--width-10 nhsuk-u-width-one-half"
            prompt="Choose a ward status"
            options={[{ name: "active" }, { name: "disabled" }]}
            onChange={(event) => {
              setWardStatus(event.target.value);
            }}
            defaultValue={wardStatus}
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
