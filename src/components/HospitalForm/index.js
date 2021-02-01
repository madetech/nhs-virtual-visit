import React, { useState } from "react";
import Button from "../Button";
import FormGroup from "../FormGroup";
import FormHeading from "../FormHeading";
import Input from "../Input";
import Label from "../Label";
import Form from "../Form";
import isPresent from "../../helpers/isPresent";
import { hasError, errorMessage } from "../../helpers/pageErrorHandler";

const HospitalForm = ({ errors, setErrors, hospital = {}, submit }) => {
  const [hospitalName, setHospitalName] = useState(hospital.name);
  const [hospitalCode, setHospitalCode] = useState(hospital.code);

  let action = "Add";
  if (hospital.uuid) {
    action = "Edit";
  }

  const onSubmit = async () => {
    let onSubmitErrors = [];

    const setHospitalNameError = (e) => {
      e.push({
        id: "hospital-name-error",
        message: "Enter a hospital name",
      });
    };

    const setHospitalCodeError = (e) => {
      e.push({
        id: "hospital-code-error",
        message: "Enter a hospital code",
      });
    };

    if (!isPresent(hospitalName)) {
      setHospitalNameError(onSubmitErrors);
    }

    if (!isPresent(hospitalCode) && action == "Add") {
      setHospitalCodeError(onSubmitErrors);
    }

    if (onSubmitErrors.length === 0) {
      return await submit({
        name: hospitalName,
        code: hospitalCode,
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
          hasError={hasError(errors, "hospital-name")}
          errorMessage={errorMessage(errors, "hospital-name")}
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
            hasError={hasError(errors, "hospital-code")}
            errorMessage={errorMessage(errors, "hospital-code")}
            className="nhsuk-input--width-10"
            onChange={(event) => setHospitalCode(event.target.value)}
            name="hospital-code"
            autoComplete="off"
            value={hospitalCode || ""}
          />
        </FormGroup>
      )}
      <Button data-testid="editHospital" className="nhsuk-u-margin-top-5">
        {action} hospital
      </Button>
    </Form>
  );
};

export default HospitalForm;
