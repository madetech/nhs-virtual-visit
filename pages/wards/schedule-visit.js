import React, { useCallback, useState } from "react";
import Button from "../../src/components/Button";
import FormGroup from "../../src/components/FormGroup";
import { GridRow, GridColumn } from "../../src/components/Grid";
import Heading from "../../src/components/Heading";
import Hint from "../../src/components/Hint";
import Input from "../../src/components/Input";
import DateSelect from "../../src/components/DateSelect";
import Layout from "../../src/components/Layout";
import ErrorSummary from "../../src/components/ErrorSummary";
import validateMobileNumber from "../../src/helpers/validateMobileNumber";
import moment from "moment";
import verifyToken from "../../src/usecases/verifyToken";
import TokenProvider from "../../src/providers/TokenProvider";
import LabelHeader from "../../src/components/LabelHeader";
import Router from "next/router";
import propsWithContainer from "../../src/middleware/propsWithContainer";
import retrieveVisitByCallId from "../../src/usecases/retrieveVisitByCallId";

const isValidName = (input) => {
  if (input.length !== 0) {
    return input;
  }
};
const isValidDate = ({ year, month, day, hour, minute }) => {
  const dateIsValid = moment({ year, month, day }).isValid();
  const dateIsInThePast =
    dateIsValid && moment({ year, month, day }).isBefore(moment(), "day");
  const timeIsValid = moment({ hour, minute }).isValid();
  const timeIsInThePast =
    timeIsValid &&
    moment({ year, month, day, hour, minute }).isSameOrBefore(moment());
  return { dateIsValid, dateIsInThePast, timeIsValid, timeIsInThePast };
};

const Home = ({
  initialPatientName,
  initialContactName,
  initialContactNumber,
  initialCallDateTime,
}) => {
  const [contactNumber, setContactNumber] = useState(
    initialContactNumber || ""
  );
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
        message: "Enter a UK mobile number",
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

    const setInvalidDateError = (errors) => {
      errors.push({
        id: "call-date-error",
        message: "Enter a valid date",
      });
    };

    const setDateInThePastError = (errors) => {
      errors.push({
        id: "call-date-error",
        message: "Enter a date that is today or in the future",
      });
    };

    const setInvalidTimeError = (errors) => {
      errors.push({
        id: "call-time-error",
        message: "Enter a valid time",
      });
    };

    const setTimeInThePastError = (errors) => {
      errors.push({
        id: "call-time-error",
        message: "Enter a time that is in the future",
      });
    };

    try {
      if (!validateMobileNumber(contactNumber)) {
        setContactNumberError(errors);
      }
    } catch (error) {
      setContactNumberError(errors);
    }
    if (!isValidName(patientName)) {
      setPatientNameError(errors);
    }
    if (!isValidName(contactName)) {
      setContactNameError(errors);
    }

    const dateValidation = isValidDate(callDateTime);

    if (!dateValidation.dateIsValid) {
      setInvalidDateError(errors);
    }
    if (dateValidation.dateIsInThePast) {
      setDateInThePastError(errors);
    }
    if (!dateValidation.timeIsValid) {
      setInvalidTimeError(errors);
    }
    if (dateValidation.timeIsInThePast) {
      setTimeInThePastError(errors);
    }
    setErrors(errors);

    if (errors.length === 0) {
      Router.push({
        pathname: `/wards/schedule-confirmation`,
        query: { patientName, contactNumber, contactName, ...callDateTime },
      });
    }
  });
  return (
    <Layout title="Schedule a virtual visit" hasErrors={errors.length != 0}>
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <form onSubmit={onSubmit}>
            <Heading>Schedule a virtual visit</Heading>
            <FormGroup>
              <LabelHeader htmlFor="patient-name">
                What is the patient's name?
              </LabelHeader>
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

              <LabelHeader htmlFor="contact-name">
                What is their key contact's name?
              </LabelHeader>
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

              <LabelHeader htmlFor="contact">
                What is their key contact's mobile number?
              </LabelHeader>

              <Hint className="nhsuk-u-margin-bottom-2">
                This must be a valid mobile number, for example
                0&zwj;7&zwj;7&zwj;0&zwj;0 9&zwj;0&zwj;0 9&zwj;8&zwj;2 a UK
                number, or
                +3&zwj;9&zwj;3&zwj;1&zwj;2&zwj;3&zwj;4&zwj;5&zwj;6&zwj;7&zwj;8&zwj;9
                for an international number
              </Hint>
              <Hint>
                It will be used to send their key contact a text message with a
                unique link for them to join a video call with the patient.
              </Hint>
              <Input
                id="contact-number"
                type="tel"
                hasError={hasError("contact-number")}
                errorMessage="Enter a valid mobile number"
                className="nhsuk-u-font-size-32 nhsuk-input--width-10 nhsuk-u-margin-bottom-5"
                style={{ padding: "16px!important", height: "64px" }}
                onChange={(event) => setContactNumber(event.target.value)}
                value={contactNumber || ""}
                name="contact"
                autoComplete="off"
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
  verifyToken(
    async ({ query, container }) => {
      let props = {};
      if (queryContainsInitialData(query)) {
        const {
          patientName,
          contactName,
          contactNumber,
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
          initialCallDateTime: callDateTime,
        };
      } else if (query.rebookCallId) {
        const { scheduledCall, error } = await retrieveVisitByCallId(container)(
          query.rebookCallId
        );
        props = {
          ...props,
          initialPatientName: scheduledCall.patientName,
          initialContactName: scheduledCall.recipientName,
          initialContactNumber: scheduledCall.recipientNumber,
        };
      }
      return { props };
    },
    {
      tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
    }
  )
);

export default Home;
