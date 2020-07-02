import React, { useCallback, useState } from "react";
import Button from "../Button";
import FormGroup from "../FormGroup";
import Heading from "../Heading";
import Input from "../Input";
import ErrorSummary from "../ErrorSummary";
import Label from "../Label";
import Router from "next/router";

const isPresent = (input) => {
  if (input.length !== 0) {
    return input;
  }
};

const EditHospitalForm = ({ errors, setErrors, hospital }) => {
  const [hospitalName, setHospitalName] = useState(hospital.name);
  const [hospitalSurveyUrl, setHospitalSurveyUrl] = useState(
    hospital.surveyUrl
  );
  let onSubmitErrors = [];

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const submitAnswers = async () =>
    await fetch("/api/update-a-hospital", {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        id: hospital.id,
        name: hospitalName,
        surveyUrl: hospitalSurveyUrl,
      }),
    })
      .then((response) => {
        if (!response.ok) throw Error(response.status);
        return response.json();
      })
      .then((result) =>
        Router.push({
          pathname: `/trust-admin/hospitals/${result.hospitalId}/edit-success`,
        })
      )
      .catch(() => {
        onSubmitErrors.push({
          id: "hospital-update-error",
          message: "There was a problem saving your changes",
        });
        setErrors(onSubmitErrors);
      });

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    onSubmitErrors = [];
    const setHospitalNameError = (errors) => {
      errors.push({
        id: "hospital-name-error",
        message: "Enter a hospital name",
      });
    };

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
        <Heading>Edit a hospital</Heading>
        <FormGroup>
          <Label htmlFor="hospital-name" className="nhsuk-label--l">
            What is the hospital name?
          </Label>
          <Input
            id="hospital-name"
            type="text"
            hasError={hasError("hospital-name")}
            errorMessage={errorMessage("hospital-name")}
            className="nhsuk-u-font-size-32 nhsuk-input--width-10"
            style={{ padding: "16px!important", height: "64px" }}
            onChange={(event) => setHospitalName(event.target.value)}
            name="hospital-name"
            autoComplete="off"
            value={hospitalName || ""}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="hospital-survey-url" className="nhsuk-label--l">
            Key contact survey URL
          </Label>
          <span className="nhsuk-hint" id="hospital-survey-url-hint">
            The survey URL will appear on the visit complete page for the key
            contact.
          </span>
          <Input
            id="hospital-survey-url"
            type="url"
            hasError={hasError("hospital-survey-url")}
            errorMessage={errorMessage("hospital-survey-url")}
            className="nhsuk-u-font-size-32 nhsuk-input--width-10"
            style={{ padding: "16px!important", height: "64px" }}
            onChange={(event) => setHospitalSurveyUrl(event.target.value)}
            name="hospital-survey-url"
            autoComplete="off"
            value={hospitalSurveyUrl || null}
          />
        </FormGroup>

        <Button className="nhsuk-u-margin-top-5">Edit hospital</Button>
      </form>
    </>
  );
};

export default EditHospitalForm;
