import React, { useCallback, useState } from "react";
import Button from "../../../src/components/Button";
import FormGroup from "../../../src/components/FormGroup";
import { GridRow, GridColumn } from "../../../src/components/Grid";
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

const isValidDate = ({ year, month, day, hour, min }) => {
  const parsed = moment([year, month, day, hour, min]);
  return parsed.isValid() && parsed.isAfter(moment());
};

const Home = () => {
  const [contactNumber, setContactNumber] = useState("");
  const [patientName, setPatientName] = useState("");
  const [callTime, setCallTime] = useState("");

  const [errors, setErrors] = useState([]);

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
        message: "Enter a patients name",
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

    if (errors.length === 0) {
      const response = await fetch("/api/schedule-visitation", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          contactNumber,
          patientName,
          callTime,
        }),
      });

      const { callUrl, err } = await response.json();

      if (callUrl) {
        window.location.href = callUrl;
      } else {
        console.error(err);
      }
    }
  });

  return (
    <Layout title="Call a key contact" hasErrors={errors.length != 0}>
      <GridRow>
        <GridColumn width="two-thirds">
          <ErrorSummary errors={errors} />
          <form onSubmit={onSubmit}>
            <Heading>Call a key contact</Heading>
            <FormGroup>
              <Label htmlFor="contact">Key contact's mobile number</Label>
              <Hint className="nhsuk-u-margin-bottom-2">
                This must be a UK mobile number, like 07700 900 982.
              </Hint>
              <Hint>
                It will be used to send your key contact a text message with a
                unique link for them to join a video call with you.
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
                name="contact"
                autoComplete="off"
              />
              <Label htmlFor="patient-name">Patient name</Label>
              <Hint className="nhsuk-u-margin-bottom-2">
                Enter the name of the patient
              </Hint>
              <Hint>This will help us identify who you are calling</Hint>
              <Input
                id="patient-name"
                type="text"
                hasError={hasError("patient-name")}
                errorMessage="Enter the patients name"
                className="nhsuk-u-font-size-32 nhsuk-input--width-10 nhsuk-u-margin-bottom-5"
                style={{ padding: "32px 16px!important" }}
                onChange={(event) => setPatientName(event.target.value)}
                name="patient-name"
                autoComplete="off"
              />
              <DateSelect
                onChange={(date) => setCallTime(date)}
                name="call-time"
                hasError={hasError("call-time")}
                errorMessage="Enter a valid date"
              ></DateSelect>
              <br></br>
              <Button className="nhsuk-u-margin-top-5">Send invite</Button>
            </FormGroup>
          </form>
        </GridColumn>
        <span style={{ clear: "both", display: "block" }}></span>
      </GridRow>
    </Layout>
  );
};

export const getServerSideProps = verifyToken(() => {}, {
  tokens: new TokenProvider(process.env.JWT_SIGNING_KEY),
});

export default Home;
