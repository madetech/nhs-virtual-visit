import React, { useCallback, useState } from "react";
import Button from "../Button";
import FormGroup from "../FormGroup";
import Heading from "../Heading";
import Input from "../Input";
import ErrorSummary from "../ErrorSummary";
import Label from "../Label";
import Router from "next/router";
import Select from "../../components/Select";
import isPresent from "../../helpers/isPresent";

const EditWardForm = ({
  errors,
  setErrors,
  id,
  initialName,
  initialHospitalId,
  hospitals,
}) => {
  const hospital = hospitals.find(
    (hospital) => hospital.id === initialHospitalId
  );
  const [hospitalId, setHospitalId] = useState(hospital.id);
  const [wardName, setWardName] = useState(initialName);
  let onSubmitErrors = [];

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const submitAnswers = async () =>
    await fetch("/api/update-a-ward", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id,
        name: wardName,
        hospitalId,
      }),
    })
      .then((response) => {
        if (!response.ok) throw Error(response.status);
        return response.json();
      })
      .then((response) =>
        Router.push(
          "/trust-admin/wards/[id]/edit-success",
          `/trust-admin/wards/${response.wardId}/edit-success`
        )
      )
      .catch(() => {
        onSubmitErrors.push({
          id: "ward-update-error",
          message: "There was a problem saving your changes",
        });
        setErrors(onSubmitErrors);
      });

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    onSubmitErrors = [];
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

    if (!isPresent(wardName)) {
      setWardNameError(onSubmitErrors);
    }
    if (!isPresent(hospitalId)) {
      setHospitalIdError(onSubmitErrors);
    }
    if (onSubmitErrors.length === 0) {
      await submitAnswers();
    }
    setErrors(onSubmitErrors);
  });

  return (
    <>
      <ErrorSummary errors={errors} />
      <form onSubmit={onSubmit}>
        <Heading>Edit a ward</Heading>
        <FormGroup>
          <Label htmlFor="ward-name" className="nhsuk-label--l">
            What is the ward name?
          </Label>
          <Input
            id="ward-name"
            type="text"
            hasError={hasError("ward-name")}
            errorMessage={errorMessage("ward-name")}
            className="nhsuk-u-font-size-32 nhsuk-input--width-10"
            style={{ padding: "16px!important", height: "64px" }}
            onChange={(event) => setWardName(event.target.value)}
            name="ward-name"
            autoComplete="off"
            value={wardName || ""}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="hospital-id" className="nhsuk-label--l">
            What is the hospital name?
          </Label>
          <Select
            id="hospital-id"
            className="nhsuk-input--width-10 nhsuk-u-width-one-half"
            prompt="Choose a hospital"
            options={hospitals}
            onChange={(event) => {
              setHospitalId(event.target.value);
            }}
            hasError={hasError("hospital-id")}
            errorMessage={errorMessage("hospital-id")}
            defaultValue={hospital.id}
          />
        </FormGroup>

        <Button className="nhsuk-u-margin-top-5">Edit ward</Button>
      </form>
    </>
  );
};

export default EditWardForm;
