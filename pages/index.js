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
import ErrorMessage from "../src/components/ErrorMessage";
import fetch from "isomorphic-unfetch";

const Home = () => {
  const [contactNumber, setContactNumber] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isValidForm, setIsValidForm] = useState(false);
  const [isContactNumberError, setIsContactNumberError] = useState(false);

  const onSubmit = useCallback(async (event) => {
    event.preventDefault();
    setIsSubmitted(true);

    const phoneUtil = require("google-libphonenumber").PhoneNumberUtil.getInstance();

    try {
      const parsedCntactNumber = phoneUtil.parseAndKeepRawInput(
        contactNumber,
        "GB"
      );

      if (
        phoneUtil.isValidNumber(parsedCntactNumber) &&
        phoneUtil.getNumberType(parsedCntactNumber) == 1
      ) {
        setIsValidForm(true);
        setIsContactNumberError(false);
      } else {
        setIsValidForm(false);
        setIsContactNumberError(true);
      }
    } catch (error) {
      setIsValidForm(false);
      setIsContactNumberError(true);
      console.log(error.message);
    }

    if (isValidForm) {
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
    <Layout>
      <GridRow>
        <GridColumn width="two-thirds">
          {isSubmitted && !isValidForm && <ErrorSummary />}
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
              {isContactNumberError && <ErrorMessage />}
              <Input
                type="number"
                maxLength={11}
                className={
                  isContactNumberError
                    ? "nhsuk-input--error nhsuk-u-font-size-32 nhsuk-input--width-10"
                    : "nhsuk-u-font-size-32 nhsuk-input--width-10"
                }
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
