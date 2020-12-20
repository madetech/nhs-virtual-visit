import React, { useState } from "react";
import Button from "../Button";
import FormGroup from "../FormGroup";
import FormHeading from "../FormHeading";
import Input from "../Input";
import Label from "../Label";
import Form from "../Form";
import validateUrl from "../../helpers/validateUrl";
import isPresent from "../../helpers/isPresent";
import Select from "../../components/Select";

const EditHospitalForm = ({ errors, setErrors, hospital = {}, submit }) => {
  const [hospitalName, setHospitalName] = useState(hospital.name);
  const [hospitalStatus, setHospitalStatus] = useState(hospital.status);
  const [hospitalSurveyUrl, setHospitalSurveyUrl] = useState(
    hospital.surveyUrl
  );
  const [hospitalSupportUrl, setHospitalSupportUrl] = useState(
    hospital.supportUrl
  );
  const [hospitalCode, setHospitalCode] = useState(hospital.code);

  const action = hospital.id ? "Edit" : "Add";

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const onSubmit = async () => {
    let onSubmitErrors = [];

    const setHospitalNameError = (e) => {
      e.push({
        id: "hospital-name-error",
        message: "Enter a hospital name",
      });
    };

    const setHospitalStatusError = (e) => {
      e.push({
        id: "hospital-status-error",
        message: "Enter a hospital status",
      });
    };

    const setHospitalCodeError = (e) => {
      e.push({
        id: "hospital-code-error",
        message: "Enter a hospital code",
      });
    };

    const setHospitalSurveyUrlInvalidError = (e) => {
      e.push({
        id: "hospital-survey-url-error",
        message: "Enter a valid survey URL",
      });
    };

    const setHospitalSupportUrlInvalidError = (e) => {
      e.push({
        id: "hospital-support-url-error",
        message: "Enter a valid support URL",
      });
    };

    if (!isPresent(hospitalName)) {
      setHospitalNameError(onSubmitErrors);
    }

    if (!isPresent(hospitalCode) && action == "Add") {
      setHospitalCodeError(onSubmitErrors);
    }

    if (!isPresent(hospitalStatus) && action == "Edit") {
      setHospitalStatusError(onSubmitErrors);
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
        code: hospitalCode,
        status: hospitalStatus,
      });
    } else setErrors(onSubmitErrors);
  };

  return (
    <Form onSubmit={onSubmit}>
      <FormHeading>{action} a hospital</FormHeading>
      <FormGroup>
        <Label htmlFor="hospital-name" className="nhsuk-label--m">
          What is the hospital name?
        </Label>
        <Input
          id="hospital-name"
          type="text"
          hasError={hasError("hospital-name")}
          errorMessage={errorMessage("hospital-name")}
          className="nhsuk-u-width-three-quarters"
          onChange={(event) => setHospitalName(event.target.value)}
          name="hospital-name"
          autoComplete="off"
          value={hospitalName || ""}
        />
      </FormGroup>
      {action === "Add" && (
        <FormGroup>
          <Label htmlFor="hospital-code" className="nhsuk-label--m">
            Create a hospital code
          </Label>
          <Input
            id="hospital-code"
            type="text"
            hasError={hasError("hospital-code")}
            errorMessage={errorMessage("hospital-code")}
            className="nhsuk-input--width-10"
            onChange={(event) => setHospitalCode(event.target.value)}
            name="hospital-code"
            autoComplete="off"
            value={hospitalCode || ""}
          />
        </FormGroup>
      )}
      {action === "Edit" && (
        <FormGroup>
          <Label htmlFor="hospital-status" className="nhsuk-label--m">
            Hospital Status
          </Label>
          <Select
            id="hospital-status"
            className="nhsuk-input--width-10 nhsuk-u-width-one-half"
            prompt="Choose a hospital status"
            options={[
              { id: 1, name: "active" },
              { id: 2, name: "disabled" },
            ]}
            onChange={(event) => {
              setHospitalStatus(
                event.target.value == 1 ? "active" : "disabled"
              );
            }}
            hasError={hasError("hospital-status")}
            errorMessage={errorMessage("hospital-status")}
            defaultValue={hospitalStatus === "active" ? 1 : 2}
          />
        </FormGroup>
      )}

      <FormGroup>
        <Label htmlFor="hospital-survey-url" className="nhsuk-label--m">
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
          onChange={(event) => setHospitalSurveyUrl(event.target.value)}
          name="hospital-survey-url"
          value={hospitalSurveyUrl || ""}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="hospital-support-url" className="nhsuk-label--m">
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
          onChange={(event) => setHospitalSupportUrl(event.target.value)}
          name="hospital-support-url"
          value={hospitalSupportUrl || ""}
        />
      </FormGroup>

      <Button data-testid="editHospital" className="nhsuk-u-margin-top-5">
        {action} hospital
      </Button>
    </Form>
  );
};

export default EditHospitalForm;
