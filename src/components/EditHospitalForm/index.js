import React, { useCallback, useState } from "react";
import Button from "../Button";
import FormGroup from "../FormGroup";
import Heading from "../Heading";
import Input from "../Input";
import ErrorSummary from "../ErrorSummary";
import Label from "../Label";
import validateUrl from "../../helpers/validateUrl";
import isPresent from "../../helpers/isPresent";

const EditHospitalForm = ({ errors, setErrors, hospital, submit }) => {
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

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    onSubmitErrors = [];
    const setHospitalNameError = (errors) => {
      errors.push({
        id: "hospital-name-error",
        message: "Enter a hospital name",
      });
    };

    const setHospitalSurveyUrlInvalidError = (errors) => {
      errors.push({
        id: "hospital-survey-url-error",
        message: "Enter a valid survey URL",
      });
    };

    if (!isPresent(hospitalName)) {
      setHospitalNameError(onSubmitErrors);
    }

    if (isPresent(hospitalSurveyUrl) && !validateUrl(hospitalSurveyUrl)) {
      setHospitalSurveyUrlInvalidError(onSubmitErrors);
    }

    if (onSubmitErrors.length === 0) {
      await submit({
        name: hospitalName,
        surveyUrl: hospitalSurveyUrl,
      });
    }
    setErrors(onSubmitErrors);
  });

  const action = hospital.id ? "Edit" : "Add";

  return (
    <>
      <ErrorSummary errors={errors} />
      <form onSubmit={onSubmit}>
        <Heading>{action} a hospital</Heading>
        <FormGroup>
          <Label htmlFor="hospital-name" className="nhsuk-label--l">
            What is the hospital name?
          </Label>
          <Input
            id="hospital-name"
            type="text"
            hasError={hasError("hospital-name")}
            errorMessage={errorMessage("hospital-name")}
            className="nhsuk-u-font-size-32"
            style={{ padding: "16px!important", height: "64px" }}
            onChange={(event) => setHospitalName(event.target.value)}
            name="hospital-name"
            autoComplete="off"
            value={hospitalName || ""}
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="hospital-survey-url" className="nhsuk-label--l">
            Key contact survey URL (optional)
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
            className="nhsuk-u-font-size-32"
            style={{ padding: "16px!important", height: "64px" }}
            onChange={(event) => setHospitalSurveyUrl(event.target.value)}
            name="hospital-survey-url"
            value={hospitalSurveyUrl || ""}
          />
        </FormGroup>

        <Button className="nhsuk-u-margin-top-5">{action} hospital</Button>
      </form>
    </>
  );
};

export default EditHospitalForm;
