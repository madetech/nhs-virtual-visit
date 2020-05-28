import React from "react";
import Label from "../Label";
import Input from "../Input";
import FormGroup from "../FormGroup";
import ErrorMessage from "../ErrorMessage";

const VisitorContactDetailsInput = ({
  textMessageIsChecked,
  setTextMessageIsChecked,
  emailIsChecked,
  setEmailIsChecked,
  hasContactMethodUncheckedError,
  hasContactNumberError,
  contactNumber,
  setContactNumber,
  hasContactEmailError,
  contactEmail,
  setContactEmail,
}) => {
  return (
    <FormGroup hasError={hasContactMethodUncheckedError}>
      <fieldset className="nhsuk-fieldset">
        <Label className="nhsuk-label--l">
          How does the key contact want to be notified?
        </Label>

        {hasContactMethodUncheckedError && (
          <ErrorMessage id="contact-method-error">
            Select how the key contact wants to be notified
          </ErrorMessage>
        )}
        <div className="nhsuk-checkboxes">
          <div className="nhsuk-checkboxes__item">
            <input
              className="nhsuk-checkboxes__input"
              id="text-message"
              data-testid="text-message"
              name="text-message"
              type="checkbox"
              checked={textMessageIsChecked}
              onChange={(event) => {
                setTextMessageIsChecked(event.target.checked);
              }}
            />
            <Label
              htmlFor="text-message"
              className="nhsuk-label nhsuk-checkboxes__label"
            >
              Text message
            </Label>
          </div>

          <div
            className="nhsuk-checkboxes__conditional"
            hidden={!textMessageIsChecked}
          >
            <FormGroup>
              <Label htmlFor="contact-number" className="nhsuk-label">
                Mobile phone number
              </Label>
              <Input
                className="nhsuk-u-font-size-32 nhsuk-input--width-10"
                style={{ padding: "16px!important", height: "64px" }}
                id="contact-number"
                data-testid="contact-number"
                name="contact-number"
                hasError={hasContactNumberError}
                errorMessage="Enter a valid mobile number"
                onChange={(event) => setContactNumber(event.target.value)}
                type="text"
                value={contactNumber}
                autoComplete="off"
              />
            </FormGroup>
          </div>
        </div>
        <div className="nhsuk-checkboxes">
          <div className="nhsuk-checkboxes__item">
            <input
              className="nhsuk-checkboxes__input"
              id="email-checkbox"
              data-testid="email-checkbox"
              name="email-checkbox"
              type="checkbox"
              checked={emailIsChecked}
              onChange={(event) => {
                setEmailIsChecked(event.target.checked);
              }}
            />
            <Label
              htmlFor="email-checkbox"
              className="nhsuk-label nhsuk-checkboxes__label"
            >
              Email
            </Label>
          </div>

          <div
            className="nhsuk-checkboxes__conditional"
            hidden={!emailIsChecked}
          >
            <FormGroup>
              <Label htmlFor="email-address" className="nhsuk-label">
                Email address
              </Label>
              <Input
                className="nhsuk-u-font-size-32"
                style={{ padding: "16px!important", height: "64px" }}
                id="email-address"
                data-testid="email-address"
                name="email-address"
                hasError={hasContactEmailError}
                errorMessage="Enter a valid email address"
                onChange={(event) => setContactEmail(event.target.value)}
                type="text"
                value={contactEmail}
                autoComplete="off"
              />
            </FormGroup>
          </div>
        </div>
      </fieldset>
    </FormGroup>
  );
};

export default VisitorContactDetailsInput;
