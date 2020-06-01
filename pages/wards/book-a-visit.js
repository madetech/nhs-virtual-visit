import React, { useCallback, useState } from "react";
import Button from "../../src/components/Button";
import FormGroup from "../../src/components/FormGroup";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Input from "../../src/components/Input";
import DateSelect from "../../src/components/DateSelect";
import Layout from "../../src/components/Layout";
import ErrorSummary from "../../src/components/ErrorSummary";
import validateMobileNumber from "../../src/helpers/validateMobileNumber";
import verifyToken from "../../src/usecases/verifyToken";
import Label from "../../src/components/Label";
import VisitorContactDetailsInput from "../../src/components/VisitorContactDetailsInput";
import Router from "next/router";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import validateDateAndTime from "../../src/helpers/validateDateAndTime";
import validateEmailAddress from "../../src/helpers/validateEmailAddress";

const isValidName = (input) => {
  if (input.length !== 0) {
    return input;
  }
};

const BookAVisit = ({
  initialPatientName,
  initialContactName,
  initialContactNumber,
  initialContactEmail,
  initialCallDateTime,
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

  const [errors, setErrors] = useState([]);

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

  const errorMessage = (field) => {
    const error = errors.filter((error) => error.id === `${field}-error`);
    return error.length === 1 ? error[0].message : "";
  };

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const errors = [];

    const setContactNumberError = (errors) => {
      errors.push({
        id: "contact-number-error",
        message: "Enter a valid mobile number",
      });
    };

    const setContactEmailError = (errors) => {
      errors.push({
        id: "contact-email-error",
        message: "Enter a valid email address",
      });
    };

    const setContactMethodUncheckedError = (errors) => {
      errors.push({
        id: "contact-method-error",
        message: "Select how the key contact wants to be notified",
      });
    };

    const setPatientNameError = (errors) => {
      errors.push({
        id: "patient-name-error",
        message: "Enter a patient's name",
      });
    };

    const setContactNameError = (errors) => {
      errors.push({
        id: "contact-name-error",
        message: "Enter a key contact's name",
      });
    };

    const setDateValidationError = (errorMessage) => {
      errors.push({
        id: "call-date-error",
        message: errorMessage,
      });
    };

    const setTimeValidationError = (errorMessage) => {
      errors.push({
        id: "call-time-error",
        message: errorMessage,
      });
    };

    if (!isValidName(patientName)) {
      setPatientNameError(errors);
    }
    if (!isValidName(contactName)) {
      setContactNameError(errors);
    }

    if (!textMessageIsChecked && !emailIsChecked) {
      setContactMethodUncheckedError(errors);
    }
    try {
      if (textMessageIsChecked && !validateMobileNumber(contactNumber)) {
        setContactNumberError(errors);
      }
    } catch (error) {
      setContactNumberError(errors);
    }

    if (emailIsChecked && !validateEmailAddress(contactEmail)) {
      setContactEmailError(errors);
    }

    const { isValidDate, isValidTime, errorMessage } = validateDateAndTime(
      callDateTime
    );

    if (!isValidDate) {
      setDateValidationError(errorMessage);
    }
    if (!isValidTime) {
      setTimeValidationError(errorMessage);
    }

    setErrors(errors);

    if (errors.length === 0) {
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
      Router.push({
        pathname: `/wards/book-a-visit-confirmation`,
        query,
      });
    }
  });
  return (
    <Layout
      title="Book a virtual visit"
      hasErrors={errors.length != 0}
      showNavigationBarForType="wardStaff"
    >
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
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
                  hasError("call-date") && errorMessage("call-date")
                }
                hasTimeError={hasError("call-time")}
                timeErrorMessage={
                  hasError("call-time") && errorMessage("call-time")
                }
                initialDate={callDateTime}
              ></DateSelect>
              <br></br>
              <Button className="nhsuk-u-margin-top-5">Continue</Button>
            </FormGroup>
          </form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

const queryContainsInitialData = (query) => {
  const initialDataKeys = [
    "patientName",
    "contactName",
    "contactNumber",
    "contactEmail",
    "day",
    "month",
    "year",
    "hour",
    "minute",
  ];

  const queryKeys = Object.keys(query);
  return initialDataKeys.every((key) => queryKeys.includes(key));
};

export const getServerSideProps = propsWithContainer(
  verifyToken(async ({ query, container }) => {
    let props = {};
    if (queryContainsInitialData(query)) {
      const {
        patientName,
        contactName,
        contactNumber,
        contactEmail,
        day,
        month,
        year,
        hour,
        minute,
      } = query;
      const callDateTime = { day, month, year, hour, minute };

      props = {
        ...props,
        initialPatientName: patientName,
        initialContactName: contactName,
        initialContactNumber: contactNumber,
        initialContactEmail: contactEmail,
        initialCallDateTime: callDateTime,
      };
    } else if (query.rebookCallId) {
      const retrieveVisitByCallId = container.getRetrieveVisitByCallId();
      const { scheduledCall } = await retrieveVisitByCallId(query.rebookCallId);

      let proposedCallDateTime = new Date(scheduledCall.callTime);
      proposedCallDateTime.setDate(proposedCallDateTime.getDate() + 1);

      const nextCallDateTime = {
        day: proposedCallDateTime.getDate(),
        month: proposedCallDateTime.getMonth(),
        year: proposedCallDateTime.getFullYear(),
        hour: proposedCallDateTime.getHours(),
        minute: proposedCallDateTime.getMinutes(),
      };

      props = {
        ...props,
        initialPatientName: scheduledCall.patientName,
        initialContactName: scheduledCall.recipientName,
        initialContactNumber: scheduledCall.recipientNumber,
        initialContactEmail: scheduledCall.recipientEmail,
        initialCallDateTime: nextCallDateTime,
      };
    }
    return { props };
  })
);

export default BookAVisit;
