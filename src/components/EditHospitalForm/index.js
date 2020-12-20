import React, { useState } from "react";
import Button from "../Button";
import FormGroup from "../FormGroup";
import FormHeading from "../FormHeading";
import Input from "../Input";
import Label from "../Label";
import Form from "../Form";
import isPresent from "../../helpers/isPresent";
import SelectStatus from "../../components/SelectStatus";


const EditHospitalForm = ({ errors, setErrors, hospital = {}, submit }) => {
  const [hospitalName, setHospitalName] = useState(hospital.name);
  const [hospitalStatus, setHospitalStatus] = useState(hospital.status);
  const [hospitalCode, setHospitalCode] = useState(hospital.code);

  let action = "Add";
  if (hospital.id) {
    action = "Edit";
  }


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

    if (!isPresent(hospitalName)) {
      setHospitalNameError(onSubmitErrors);
    }

    if (!isPresent(hospitalCode) && action == "Add") {
      setHospitalCodeError(onSubmitErrors);
    }

    if (!isPresent(hospitalStatus) && action == "Edit") {
      setHospitalStatusError(onSubmitErrors);
    }

    if (onSubmitErrors.length === 0) {
      return await submit({
        name: hospitalName,
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
          <SelectStatus
            id="hospital-status"
            className="nhsuk-input--width-10 nhsuk-u-width-one-half"
            prompt="Choose a hospital status"
            options={[
              { name: "active" },
              { name: "disabled" },
            ]}
            onChange={(event) => {
              setHospitalStatus(
                event.target.value
              );
            }}
            hasError={hasError("hospital-status")}
            errorMessage={errorMessage("hospital-status")}
            defaultValue={hospitalStatus}
          />
        </FormGroup>
      )}
      <Button data-testid="editHospital" className="nhsuk-u-margin-top-5">
        {action} hospital
      </Button>
    </Form>
  );
};

export default EditHospitalForm;