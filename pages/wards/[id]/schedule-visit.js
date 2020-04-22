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

const isValidDate = ({ year, month, day, hour, minute }) => {
  const parsed = moment({ year, month, day, hour, minute });
  return parsed.isValid() && parsed.isAfter(moment());
};

const Success = ({ id }) => {
  return (
    <Layout title="Schedule a virtual visit">
      <GridRow>
        <GridColumn width="two-thirds">
          <Heading>Virtual visit scheduled</Heading>

          <Text>
            Your virtual visit has been scheduled and the key contact has been
            sent an SMS with their scheduled time.
          </Text>

          <ActionLink href={`/wards/${id}/schedule-visit`}>
            Schedule another visit
          </ActionLink>
          <ActionLink href={`/wards/${id}/visits`}>View visits</ActionLink>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

const CheckAnswers = ({ onSubmit, patientName, contactNumber, callTime }) => {
  return (
    <Layout title="Check your answers before scheduling a visit">
      <GridRow>
        <GridColumn width="two-thirds">
          <form onSubmit={onSubmit}>
            <Heading>Check your answers before scheduling a visit</Heading>
            <dl className="nhsuk-summary-list">
              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Patient's name</dt>
                <dd className="nhsuk-summary-list__value">{patientName}</dd>
                <dd className="nhsuk-summary-list__actions">
                  <a href="#" onClick={() => setConfirmation(false)}>
                    Change
                    <span className="nhsuk-u-visually-hidden">
                      {" "}
                      patient's name
                    </span>
                  </a>
                </dd>
              </div>

              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">
                  Key contact mobile number
                </dt>
                <dd className="nhsuk-summary-list__value">{contactNumber}</dd>
                <dd className="nhsuk-summary-list__actions">
                  <a href="#" onClick={() => setConfirmation(false)}>
                    Change
                    <span className="nhsuk-u-visually-hidden">
                      {" "}
                      key contact number
                    </span>
                  </a>
                </dd>
              </div>

              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Date of call</dt>
                <dd className="nhsuk-summary-list__value">
                  {moment(callTime).format("D MMMM YYYY")}
                </dd>
                <dd className="nhsuk-summary-list__actions">
                  <a href="#" onClick={() => setConfirmation(false)}>
                    Change
                    <span className="nhsuk-u-visually-hidden">
                      {" "}
                      date of call
                    </span>
                  </a>
                </dd>
              </div>

              <div className="nhsuk-summary-list__row">
                <dt className="nhsuk-summary-list__key">Time of call</dt>
                <dd className="nhsuk-summary-list__value">
                  {moment(callTime).format("hh:mma")}
                </dd>
                <dd className="nhsuk-summary-list__actions">
                  <a href="#" onClick={() => setConfirmation(false)}>
                    Change
                    <span className="nhsuk-u-visually-hidden">
                      {" "}
                      date of call
                    </span>
                  </a>
                </dd>
              </div>
            </dl>
            <Button className="nhsuk-u-margin-top-5">Schedule visit</Button>
          </form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

const Home = ({ id }) => {
  const [contactNumber, setContactNumber] = useState("");
  const [patientName, setPatientName] = useState("");
  const [callTime, setCallTime] = useState("");

  const [errors, setErrors] = useState([]);
  const [confirmation, setConfirmation] = useState(false);
  const [success, setSuccess] = useState(false);

  const hasError = (field) =>
    errors.find((error) => error.id === `${field}-error`);

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

    if (!isValidDate(callTime)) {
      errors.push({
        id: "call-time-error",
        message: "Enter a valid date",
      });
    }

    setErrors(errors);

    const submitAnswers = async ({ contactNumber, patientName, callTime }) => {
      const response = await fetch("/api/schedule-visit", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          contactNumber,
          patientName,
          callTime: moment(callTime).toISOString(),
          callTimeLocal: callTime,
        }),
      });

      const { success, err } = await response.json();

      if (success) {
        setSuccess(true);
      } else {
        console.error(err);
      }
    };

    if (errors.length === 0) {
      if (confirmation) {
        submitAnswers({ contactNumber, patientName, callTime });
      } else {
        setConfirmation(true);
      }
    }
  });

  if (success) {
    return <Success id={id} />;
  }

  if (confirmation) {
    return (
      <CheckAnswers
        onSubmit={onSubmit}
        contactNumber={contactNumber}
        patientName={patientName}
        callTime={callTime}
      />
    );
  }

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
                onChange={(date) => setCallTime(date)}
                name="call-time"
                hasError={hasError("call-time")}
                errorMessage="Enter a valid date"
                initialDate={callTime}
              ></DateSelect>
              <br></br>
              <Button className="nhsuk-u-margin-top-5">Schedule visit</Button>
            </FormGroup>
          </form>
        </GridColumn>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = verifyToken(
  ({ query }) => {
    const { id } = query;
    return { props: { id } };
  },
  {
    tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
  }
);

export default Home;
