import React, { useCallback, useState } from "react";
import Button from "../Button";
import FormGroup from "../FormGroup";
import Heading from "../Heading";
import Input from "../Input";
import ErrorSummary from "../ErrorSummary";
import Label from "../Label";
import Router from "next/router";
import Select from "../../components/Select";

const isPresent = (input) => {
  if (input.length !== 0) {
    return input;
  }
};

const EditWardForm = ({
  errors,
  setErrors,
  id,
  initialName,
  initialHospitalName,
  initialHospitalId,
  hospitals,
}) => {
  const defaultHospitalId = hospitals.find(
    (hospital) => hospital.name === initialHospitalName
  ).id;
  const [hospitalId, setHospitalId] = useState(
    initialHospitalId ? initialHospitalId : defaultHospitalId
  );
  const [wardName, setWardName] = useState(initialName);
  const [hospitalName, setHospitalName] = useState(initialHospitalName);
  let onSubmitErrors = [];

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const submitAnswers = async () => {
    let name = wardName;
    const response = await fetch("/api/update-a-ward", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id,
        name,
        hospitalName,
        hospitalId,
      }),
    });

    const status = response.status;
    const { wardId } = await response.json();
    if (status == 201) {
      Router.push({
        pathname: "/admin/edit-a-ward-success",
        query: { wardId: wardId },
      });
    } else {
      setErrors(onSubmitErrors);
    }
  };

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    onSubmitErrors = [];
    const setWardNameError = (errors) => {
      errors.push({
        id: "ward-name-error",
        message: "Enter a ward name",
      });
    };

    const setHospitalNameError = (errors) => {
      errors.push({
        id: "hospital-name-error",
        message: "Select a hospital",
      });
    };

    if (!isPresent(wardName)) {
      setWardNameError(onSubmitErrors);
    }
    if (!isPresent(hospitalName)) {
      setHospitalNameError(onSubmitErrors);
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
          <Label htmlFor="hospital-name" className="nhsuk-label--l">
            What is the hospital name?
          </Label>
          <Select
            id="hospital-name"
            className="nhsuk-input--width-10 nhsuk-u-width-one-half"
            prompt="Choose a hospital"
            options={hospitals}
            onChange={(event) => {
              setHospitalId(event.target.value);
              setHospitalName(
                event.target.options[event.target.selectedIndex].text
              );
            }}
            hasError={hasError("hospital-name")}
            errorMessage={errorMessage("hospital-name")}
            defaultValue={defaultHospitalId}
          />
        </FormGroup>

        <Button className="nhsuk-u-margin-top-5">Edit ward</Button>
      </form>
    </>
  );
};

export default EditWardForm;
