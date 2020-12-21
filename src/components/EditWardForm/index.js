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

const EditWardForm = ({
  errors,
  setErrors,
  id,
  initialName,
  hospitalId,
  status,
}) => {
  const [wardName, setWardName] = useState(initialName);
  const [wardStatus, setWardStatus] = useState(status);
  let onSubmitErrors = [];

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const submitAnswers = async () => {
    try {
      const response = await fetch("/api/update-a-ward", {
        method: "PATCH",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          id,
          name: wardName,
          hospitalName: initialName,
          status: wardStatus,
          hospitalId,
        }),
      });

      if (!response.ok) {
        throw Error(response.status);
      }

      const json = await response.json();
      await Router.push(
        "/trust-admin/wards/[id]/edit-success",
        `/trust-admin/wards/${json.wardId}/edit-success`
      );
      return true;
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
            hasError={hasError("ward-name")}
            errorMessage={errorMessage("ward-name")}
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
            hasError={hasError("ward-status")}
            errorMessage={errorMessage("ward-status")}
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
