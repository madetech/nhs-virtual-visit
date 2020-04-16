import React, { useCallback, useState } from "react";
import Button from "../src/components/Button";
import FormGroup from "../src/components/FormGroup";
import { GridRow, GridColumn } from "../src/components/Grid";
import Heading from "../src/components/Heading";
import Hint from "../src/components/Hint";
import Input from "../src/components/Input";
import Label from "../src/components/Label";
import Layout from "../src/components/Layout";
import ErrorSummary from "../src/components/ErrorSummary";
import { PhoneNumberUtil, PhoneNumberType } from 'google-libphonenumber';
import fetch from "isomorphic-unfetch";

const isValidPhoneNumber = (input) => {
  const validator = PhoneNumberUtil.getInstance();
  const parsed = validator.parseAndKeepRawInput(input, "GB");
  return (
    validator.isValidNumber(parsed) &&
    validator.getNumberType(parsed) === PhoneNumberType.MOBILE
  );
};

const Home = () => {
  const [contactNumber, setContactNumber] = useState("");
  const [errors, setErrors] = useState([]);

  const hasError = (field) => errors.find(error => error.id === `${field}-error`);

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    const errors = [];

    const setContactNumberError = (errors) => {
      errors.push({
        id: 'contact-number-error',
        message: 'Enter a UK mobile number'
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

    setErrors(errors);

    if (errors.length === 0) {
      const response = await fetch("/api/calls", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({
          contactNumber,
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
                className="nhsuk-u-font-size-32 nhsuk-input--width-10"
                style={{ padding: "32px 16px!important" }}
                onChange={(event) => setContactNumber(event.target.value)}
                name="contact"
              />
              <br />
              <Button className="nhsuk-u-margin-top-5">Send invite</Button>
            </FormGroup>
          </form>
        </GridColumn>
        <span style={{ clear: "both", display: "block" }}></span>
      </GridRow>
    </Layout>
  );
};

export default Home;
