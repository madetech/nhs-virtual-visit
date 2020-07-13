import React, { useCallback, useState } from "react";
import Button from "../Button";
import FormGroup from "../FormGroup";
import Heading from "../Heading";
import Input from "../Input";
import DateSelect from "../DateSelect";
import Label from "../Label";
import VisitorContactDetailsInput from "../VisitorContactDetailsInput";
import validateMobileNumber from "../../helpers/validateMobileNumber";
import validateDateAndTime from "../../helpers/validateDateAndTime";
import validateEmailAddress from "../../helpers/validateEmailAddress";

const VisitForm = ({
  initialPatientName,
  initialContactName,
  initialContactNumber,
  initialContactEmail,
  initialCallDateTime,
  errors,
  setErrors,
  submit,
}) => {
  const [textMessageIsChecked, setTextMessageIsChecked] = useState(
    initialContactNumber?.length > 0 || false
  );
  const [emailIsChecked, setEmailIsChecked] = useState(
    initialContactEmail?.length > 0 || false
  );
  const [contactNumber, setContactNumber] = useState(
    initialContactNumber || ""
  );
  const [contactEmail, setContactEmail] = useState(initialContactEmail || "");
  const [contactName, setContactName] = useState(initialContactName || "");
  const [patientName, setPatientName] = useState(initialPatientName || "");
  const [callDateTime, setCallDateTime] = useState(initialCallDateTime || "");

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const getErrorMessage = (field) => {
    const error = errors.filter((error) => error.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const isValidName = (input) => {
    if (input.length !== 0) {
      return input;
    }
  };

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const validationErrors = [];

    if (!isValidName(patientName)) {
      validationErrors.push({
        id: "patient-name-error",
        message: "Enter a patient's name",
      });
    }
    if (!isValidName(contactName)) {
      validationErrors.push({
        id: "contact-name-error",
        message: "Enter a key contact's name",
      });
    }

    if (!textMessageIsChecked && !emailIsChecked) {
      validationErrors.push({
        id: "contact-method-error",
        message: "Select how the key contact wants to be notified",
      });
    }

    const addContactNumberError = () => {
      validationErrors.push({
        id: "contact-number-error",
        message: "Enter a valid mobile number",
      });
    };

    try {
      if (textMessageIsChecked && !validateMobileNumber(contactNumber)) {
        addContactNumberError();
      }
    } catch (error) {
      addContactNumberError();
    }

    if (emailIsChecked && !validateEmailAddress(contactEmail)) {
      validationErrors.push({
        id: "contact-email-error",
        message: "Enter a valid email address",
      });
    }

    const { isValidDate, isValidTime, errorMessage } = validateDateAndTime(
      callDateTime
    );

    if (!isValidDate) {
      validationErrors.push({
        id: "call-date-error",
        message: errorMessage,
      });
    }
    if (!isValidTime) {
      validationErrors.push({
        id: "call-time-error",
        message: errorMessage,
      });
    }

    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      let query = {
        patientName,
        contactName,
        ...callDateTime,
      };

      if (textMessageIsChecked && contactNumber) {
        query.contactNumber = contactNumber;
      }
      if (emailIsChecked && contactEmail) {
        query.contactEmail = contactEmail;
      }
      submit(query);
    }
  });

  return (
    <form onSubmit={onSubmit}>
      <Heading>Book a virtual visit</Heading>
      <FormGroup>
        <Label htmlFor="patient-name" className="nhsuk-label--l">
          What is the patient&apos;s name?
        </Label>
        <Input
          id="patient-name"
          type="text"
          hasError={hasError("patient-name")}
          errorMessage="Enter the patient's name"
          className="nhsuk-u-font-size-32 nhsuk-input--width-10 nhsuk-u-margin-bottom-5"
          style={{ padding: "16px!important", height: "64px" }}
          onChange={(event) => setPatientName(event.target.value)}
          name="patient-name"
          autoComplete="off"
          value={patientName || ""}
        />

        <Label htmlFor="contact-name" className="nhsuk-label--l">
          What is the key contact&apos;s name?
        </Label>
        <Input
          id="contact-name"
          type="text"
          hasError={hasError("contact-name")}
          errorMessage="Enter the key contact's name"
          className="nhsuk-u-font-size-32 nhsuk-input--width-10 nhsuk-u-margin-bottom-5"
          style={{ padding: "16px!important", height: "64px" }}
          onChange={(event) => setContactName(event.target.value)}
          name="contact-name"
          autoComplete="off"
          value={contactName || ""}
        />

        <VisitorContactDetailsInput
          textMessageIsChecked={textMessageIsChecked}
          setTextMessageIsChecked={setTextMessageIsChecked}
          emailIsChecked={emailIsChecked}
          setEmailIsChecked={setEmailIsChecked}
          hasContactMethodUncheckedError={hasError("contact-method")}
          hasContactNumberError={hasError("contact-number")}
          contactNumber={contactNumber}
          setContactNumber={setContactNumber}
          hasContactEmailError={hasError("contact-email")}
          contactEmail={contactEmail}
          setContactEmail={setContactEmail}
        />

        <DateSelect
          onChange={(date) => setCallDateTime(date)}
          name="call-datetime"
          hasDateError={hasError("call-date")}
          dateErrorMessage={
            hasError("call-date") && getErrorMessage("call-date")
          }
          hasTimeError={hasError("call-time")}
          timeErrorMessage={
            hasError("call-time") && getErrorMessage("call-time")
          }
          initialDate={callDateTime}
        ></DateSelect>
        <br></br>
        <Button className="nhsuk-u-margin-top-5">Continue</Button>
      </FormGroup>
    </form>
  );
};

export default VisitForm;
