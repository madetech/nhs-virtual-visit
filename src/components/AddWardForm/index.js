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

const AddWardForm = ({ errors, setErrors, hospitals }) => {
  const [hospitalName, setHospitalName] = useState("");
  const [wardName, setWardName] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [wardCodeConfirmation, setWardCodeConfirmation] = useState("");

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const onSubmitErrors = [];

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
    if (!isPresent(hospitalName)) {
      setHospitalNameError(onSubmitErrors);
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
      const submitAnswers = async ({ wardName, hospitalName, wardCode }) => {
        let name = wardName;
        let code = wardCode;

        const response = await fetch("/api/create-ward", {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
            hospitalName,
            code,
          }),
        });

        const status = response.status;
        const { wardId } = await response.json();

        if (status == 201) {
          Router.push({
            pathname: "/admin/add-a-ward-success",
            query: { wardId: wardId },
          });
        } else {
          setUniqueWardCodeError(onSubmitErrors);
          setErrors(onSubmitErrors);
        }
      };

      await submitAnswers({ wardName, hospitalName, wardCode });
    }
    setErrors(onSubmitErrors);
  });
  return (
    <>
      <ErrorSummary errors={errors} />
      <form onSubmit={onSubmit}>
        <Heading>Add a ward</Heading>
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
              setHospitalName(
                event.target.options[event.target.selectedIndex].text
              );
            }}
            hasError={hasError("hospital-name")}
            errorMessage={errorMessage("hospital-name")}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="ward-code" className="nhsuk-label--l">
            Create a ward code
          </Label>
          <Input
            id="ward-code"
            type="text"
            hasError={hasError("ward-code")}
            errorMessage={errorMessage("ward-code")}
            className="nhsuk-u-font-size-32 nhsuk-input--width-10"
            style={{ padding: "16px!important", height: "64px" }}
            onChange={(event) => setWardCode(event.target.value)}
            name="ward-code"
            autoComplete="off"
            value={wardCode || ""}
          />
        </FormGroup>
        <FormGroup>
          <Label htmlFor="ward-code-confirmation" className="nhsuk-label--l">
            Confirm the ward code
          </Label>
          <Input
            id="ward-code-confirmation"
            type="text"
            hasError={hasError("ward-code-confirmation")}
            errorMessage={errorMessage("ward-code-confirmation")}
            className="nhsuk-u-font-size-32 nhsuk-input--width-10"
            style={{ padding: "16px!important", height: "64px" }}
            onChange={(event) => setWardCodeConfirmation(event.target.value)}
            name="ward-code-confirmation"
            autoComplete="off"
            value={wardCodeConfirmation || ""}
          />
        </FormGroup>
        <br></br>
        <Button className="nhsuk-u-margin-top-5">Add ward</Button>
      </form>
    </>
  );
};

export default AddWardForm;
