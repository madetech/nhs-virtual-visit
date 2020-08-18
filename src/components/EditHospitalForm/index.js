import React, { useState } from "react";
import Button from "../Button";
import FormGroup from "../FormGroup";
import Heading from "../Heading";
import Input from "../Input";
import Label from "../Label";
import Form from "../Form";
import validateUrl from "../../helpers/validateUrl";
import isPresent from "../../helpers/isPresent";

const EditHospitalForm = ({ errors, setErrors, hospital = {}, submit }) => {
  const [hospitalName, setHospitalName] = useState(hospital.name);
  const [hospitalSurveyUrl, setHospitalSurveyUrl] = useState(
    hospital.surveyUrl
  );
  const [hospitalSupportUrl, setHospitalSupportUrl] = useState(
    hospital.supportUrl
  );

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const onSubmit = async () => {
    let onSubmitErrors = [];

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

    const setHospitalSupportUrlInvalidError = (errors) => {
      errors.push({
        id: "hospital-support-url-error",
        message: "Enter a valid support URL",
      });
    };

    if (!isPresent(hospitalName)) {
      setHospitalNameError(onSubmitErrors);
    }

    if (isPresent(hospitalSurveyUrl) && !validateUrl(hospitalSurveyUrl)) {
      setHospitalSurveyUrlInvalidError(onSubmitErrors);
    }

    if (isPresent(hospitalSupportUrl) && !validateUrl(hospitalSupportUrl)) {
      setHospitalSupportUrlInvalidError(onSubmitErrors);
    }

    if (onSubmitErrors.length === 0) {
      return await submit({
        name: hospitalName,
        surveyUrl: hospitalSurveyUrl,
        supportUrl: hospitalSupportUrl,
      });
    } else setErrors(onSubmitErrors);
  };

  const action = hospital.id ? "Edit" : "Add";

  return (
    <Form onSubmit={onSubmit}>
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
          The survey URL will appear at the end of a visit for a key contact.
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

      <FormGroup>
        <Label htmlFor="hospital-support-url" className="nhsuk-label--l">
          Key contact support URL (optional)
        </Label>
        <span className="nhsuk-hint" id="hospital-support-url-hint">
          The support URL will appear at the end of a visit for a key contact.
        </span>
        <Input
          id="hospital-support-url"
          type="url"
          hasError={hasError("hospital-support-url")}
          errorMessage={errorMessage("hospital-support-url")}
          className="nhsuk-u-font-size-32"
          style={{ padding: "16px!important", height: "64px" }}
          onChange={(event) => setHospitalSupportUrl(event.target.value)}
          name="hospital-support-url"
          value={hospitalSupportUrl || ""}
        />
      </FormGroup>

      <Button className="nhsuk-u-margin-top-5">{action} hospital</Button>
    </Form>
  );
};

export default EditHospitalForm;
