import React, { useState } from "react";
import Button from "../Button";
import FormGroup from "../FormGroup";
import Heading from "../Heading";
import Label from "../Label";
import Form from "../Form";
import SelectStatus from "../SelectStatus";

const TrustManagerForm = ({ errors, trustManager = {}, submit }) => {
  const [status, setStatus] = useState(trustManager?.status);

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((err) => err.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };
  const onSubmit = () => {
    submit();
  };

  const action = trustManager.id ? "Edit" : "Add";

  return (
    <Form onSubmit={onSubmit}>
      <Heading>{action} a Trust Manager</Heading>

      {action === "Edit" && (
        <FormGroup>
          <Label htmlFor="trust-manager-id" className="nhsuk-label--m">
            What is the status of {`${trustManager.email}`}?
          </Label>
          <SelectStatus
            id="trust-manager-id"
            className="nhsuk-input--width-10"
            prompt="Choose a status"
            options={[{ name: "active" }, { name: "disabled" }]}
            onChange={(event) => {
              setStatus(event.target.value);
            }}
            hasError={hasError("trust-manager-id")}
            errorMessage={errorMessage("trust-manager-id")}
            defaultValue={status}
          />
        </FormGroup>
      )}

      <Button className="nhsuk-u-margin-top-5">{action} a Trust Manager</Button>
    </Form>
  );
};

export default TrustManagerForm;
