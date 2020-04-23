import React, { useCallback, useState } from "react";
import Button from "../../../src/components/Button";
import FormGroup from "../../../src/components/FormGroup";
import { GridRow, GridColumn } from "../../../src/components/Grid";
import ActionLink from "../../../src/components/ActionLink";
import Text from "../../../src/components/Text";
import Heading from "../../../src/components/Heading";
import Hint from "../../../src/components/Hint";
import Input from "../../../src/components/Input";
import DateSelect from "../../../src/components/DateSelect";
import Label from "../../../src/components/Label";
import Layout from "../../../src/components/Layout";
import ErrorSummary from "../../../src/components/ErrorSummary";
import { PhoneNumberUtil, PhoneNumberType } from "google-libphonenumber";
import fetch from "isomorphic-unfetch";
import moment from "moment";
import verifyToken from "../../../src/usecases/verifyToken";
import TokenProvider from "../../../src/providers/TokenProvider";
import LabelHeader from "../../../src/components/LabelHeader";
import Router from "next/router";

const isValidPhoneNumber = (input) => {
  const validator = PhoneNumberUtil.getInstance();
  const parsed = validator.parseAndKeepRawInput(input, "GB");
  return (
    validator.isValidNumber(parsed) &&
    validator.getNumberType(parsed) === PhoneNumberType.MOBILE
  );
};

const isValidName = (input) => {
  if (input.length !== 0) {
    return input;
  }
};
const isValidDate = ({ year, month, day }) => {
  const dateIsValid = moment({ year, month, day }).isValid();
  const dateIsInThePast =
    dateIsValid && moment({ year, month, day }).isBefore(moment(), "day");
  return { dateIsValid, dateIsInThePast };
};

const isValidTime = ({ hour, minute }) => {
  const timeIsValid = moment({ hour, minute }).isValid();
  const timeIsInThePast =
    timeIsValid && moment({ hour, minute }).isSameOrBefore(moment());
  return { timeIsValid, timeIsInThePast };
};

const Home = ({
  id,
  initialPatientName,
  initialContactNumber,
  initialCallDateTime,
}) => {
  const [contactNumber, setContactNumber] = useState(
    initialContactNumber || ""
  );
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
      if (!isValidPhoneNumber(contactNumber)) {
        setContactNumberError(errors);
      }
    } catch (error) {
      setContactNumberError(errors);
      console.log(error.message);
    }
    if (!isValidName(patientName)) {
      setPatientNameError(errors);
    }
    if (!isValidDate(callDateTime).dateIsValid) {
      setInvalidDateError(errors);
    }
    if (isValidDate(callDateTime).dateIsInThePast) {
      setDateInThePastError(errors);
    }
    if (!isValidTime(callDateTime).timeIsValid) {
      setInvalidTimeError(errors);
    }
    if (isValidTime(callDateTime).timeIsInThePast) {
      setTimeInThePastError(errors);
    }
    setErrors(errors);

    if (errors.length === 0) {
      Router.push({
        pathname: `/wards/${id}/schedule-confirmation`,
        query: { patientName, contactNumber, ...callDateTime },
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
                style={{ padding: "32px 16px!important" }}
                onChange={(event) => setPatientName(event.target.value)}
                name="patient-name"
                autoComplete="off"
                value={patientName || ""}
              />

              <LabelHeader htmlFor="contact">
                What is their key contact's mobile number?
              </LabelHeader>

              <Hint className="nhsuk-u-margin-bottom-2">
                This must be a UK mobile number, like 07700 900 982.
              </Hint>
              <Hint>
                It will be used to send their key contact a text message with a
                unique link for them to join a video call with the patient.
              </Hint>
              <Input
                id="contact-number"
                type="number"
                maxLength={11}
                hasError={hasError("contact-number")}
                errorMessage="Enter a UK mobile number"
                className="nhsuk-u-font-size-32 nhsuk-input--width-10 nhsuk-u-margin-bottom-5"
                style={{ padding: "32px 16px!important" }}
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

export const getServerSideProps = verifyToken(
  ({ query }) => {
    const { id } = query;
    let props = { id };
    if (queryContainsInitialData(query)) {
      const {
        patientName,
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
        initialContactNumber: contactNumber,
        initialCallDateTime: callDateTime,
      };
    }
    return { props };
  },
  {
    tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
  }
);

export default Home;
