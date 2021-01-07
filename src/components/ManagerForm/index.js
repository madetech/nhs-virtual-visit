import React, { useState } from "react";
import Button from "../Button";
import FormGroup from "../FormGroup";
import FormHeading from "../FormHeading";
import Label from "../Label";
import Form from "../Form";
import SelectStatus from "../SelectStatus";

const ManagerForm = ({ errors, manager = {}, submit }) => {
  const [status, setStatus] = useState(manager?.status);

  const action = manager.uuid ? "Edit" : "Add";

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const onSubmit = async () => {
    return await submit({
      status,
    });
  };

  return (
    <Form onSubmit={onSubmit}>
      <FormHeading>{action} a Manager</FormHeading>

      {action === "Edit" && (
        <FormGroup>
          <Label htmlFor="manager-id" className="nhsuk-label--m">
            What is the status of {`${manager.email}`}?
          </Label>
          <SelectStatus
            id="tm-select-status"
            className="nhsuk-input--width-10"
            prompt="Choose a status"
            options={[{ name: "active" }, { name: "disabled" }]}
            onChange={(event) => {
              setStatus(event.target.value);
            }}
            hasError={hasError("tm-select-status")}
            errorMessage={errorMessage("tm-select-status")}
            defaultValue={status}
          />
        </FormGroup>
      )}

      <Button className="nhsuk-u-margin-top-5" data-cy="tm-form-submit">
        {action} a Manager
      </Button>
    </Form>
  );
};

export default ManagerForm;
