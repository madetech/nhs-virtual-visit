import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import VisitorContactDetailsInput from "../../src/components/VisitorContactDetailsInput/index";

describe("VisitorContactDetailsInput", () => {
  describe("Using the phone number section", () => {
    it("updates the state the text message is selected", () => {
      const textMessageIsChecked = false;
      const setTextMessageIsChecked = jest.fn();
      const emailIsChecked = false;
      const setEmailIsChecked = jest.fn();

      render(
        <VisitorContactDetailsInput
          textMessageIsChecked={textMessageIsChecked}
          setTextMessageIsChecked={setTextMessageIsChecked}
          emailIsChecked={emailIsChecked}
          setEmailIsChecked={setEmailIsChecked}
          hasContactNumberError={false}
          contactNumber=""
          setContactNumber={() => {}}
        />
      );

      fireEvent.click(screen.getByLabelText(/Text message/));

      expect(setTextMessageIsChecked).toHaveBeenCalledWith(true);
    });

    it("sets the contact number when number inputted", () => {
      const setContactNumberSpy = jest.fn();
      const mobileNumber = "077777777777";

      render(
        <VisitorContactDetailsInput
          hasContactNumberError={false}
          contactNumber=""
          setContactNumber={setContactNumberSpy}
        />
      );

      const contactNumberInput = screen.getByTestId("contact-number");

      fireEvent.change(contactNumberInput, { target: { value: mobileNumber } });

      expect(setContactNumberSpy).toHaveBeenCalledWith(mobileNumber);
    });

    it("shows the contact number error message when there's an error", () => {
      render(
        <VisitorContactDetailsInput
          textMessageIsChecked={true}
          setTextMessageIsChecked={jest.fn()}
          hasContactNumberError={true}
          contactNumber=""
          setContactNumber={() => {}}
        />
      );

      const contactNumberInput = screen.getByTestId("contact-number");

      fireEvent.click(screen.getByLabelText(/Text message/));
      fireEvent.change(contactNumberInput, { target: { value: "123" } });

      expect(screen.getByText(/Enter a valid mobile number/)).toBeVisible();
    });
  });

  describe("Using the email section", () => {
    it("updates the state email is selected", () => {
      const textMessageIsChecked = false;
      const setTextMessageIsChecked = jest.fn();
      const emailIsChecked = false;
      const setEmailIsChecked = jest.fn();

      render(
        <VisitorContactDetailsInput
          textMessageIsChecked={textMessageIsChecked}
          setTextMessageIsChecked={setTextMessageIsChecked}
          emailIsChecked={emailIsChecked}
          setEmailIsChecked={setEmailIsChecked}
          hasContactNumberError={false}
          contactNumber=""
          setContactNumber={() => {}}
        />
      );

      fireEvent.click(screen.getByLabelText("Email"));

      expect(setEmailIsChecked).toHaveBeenCalledWith(true);
    });

    it("sets the contact email when text inputted", () => {
      const setContactEmailSpy = jest.fn();
      const email = "leslie@knope.com";

      render(
        <VisitorContactDetailsInput
          hasContactEmailError={false}
          contactEmail=""
          setContactEmail={setContactEmailSpy}
        />
      );

      const contactEmailInput = screen.getByTestId("email-address");

      fireEvent.change(contactEmailInput, { target: { value: email } });

      expect(setContactEmailSpy).toHaveBeenCalledWith(email);
    });

    it("shows the contact email error message when there's an error", () => {
      render(
        <VisitorContactDetailsInput
          emailIsChecked={true}
          setEmailIsChecked={jest.fn()}
          hasContactEmailError={true}
          contactEmail=""
          setContactEmail={() => {}}
        />
      );

      const contactEmailInput = screen.getByTestId("email-address");

      fireEvent.click(screen.getByLabelText("Email"));
      fireEvent.change(contactEmailInput, { target: { value: "cool" } });

      expect(screen.getByText(/Enter a valid email address/)).toBeVisible();
    });
  });
});

describe("VisitorContactDetailsInput - Using Query", () => {
  it("sets the contact number in the input and checks the text message box", () => {
    render(
      <VisitorContactDetailsInput
        textMessageIsChecked={true}
        hasContactNumberError={false}
        contactNumber="077777777777"
        setContactNumber={() => {}}
      />
    );

    const input = screen.getByTestId("contact-number");

    expect(input.value).toEqual("077777777777");
    expect(screen.getByTestId("text-message").checked).toEqual(true);
  });

  it("sets the email in the input and checks the email box", () => {
    render(
      <VisitorContactDetailsInput
        emailIsChecked={true}
        hasContactEmailError={false}
        contactEmail="bob.smith@madetech.com"
        setContactEmail={() => {}}
      />
    );

    const input = screen.getByTestId("email-address");

    expect(input.value).toEqual("bob.smith@madetech.com");
    expect(screen.getByTestId("email-checkbox").checked).toEqual(true);
  });
});
