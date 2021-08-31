import {
  GivenIAmLoggedInAsATrustAdmin,
  ThenISeeTheEditAWardForm,
  ThenISeeThePageForTheHospital,
  ThenISeeTheHospitalsPage,
  WhenIClickHospitalsOnTheNavigationBar,
  WhenIClickOnAHospital,
} from "./trustAdminCommonSteps";
import { thenIClickLogOut, ThenISeeAnError } from "../commonSteps";

describe("As a trust admin, I want to edit a ward so that I can modify the details of a ward.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset:mssql && npm run dbmigratetest up:mssql"
    );
  });
  it("displays errors when information is not entered correctly", () => {
    GivenIAmLoggedInAsATrustAdmin();

    cy.log("displays an error when ward name input is hot filled")
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();
    WhenIClickOnAHospital();
    ThenISeeThePageForTheHospital();
    WhenIClickToEditADifferentWard();
    ThenISeeTheEditAWardForm();
    WhenISubmitFormWithoutFillingTheWardName();
    ThenISeeWardNameError();

    cy.log("displays an error when ward pin has more than 4 characters")
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();
    WhenIClickOnAHospital();
    ThenISeeThePageForTheHospital();
    WhenIClickToEditADifferentWard();
    ThenISeeTheEditAWardForm();
    WhenISubmitFormWithAPinMoreThanFourCharacters();
    ThenISeeWardPinLengthError();

    cy.log("displays an error when ward pin confirmation has more than 4 characters")
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();
    WhenIClickOnAHospital();
    ThenISeeThePageForTheHospital();
    WhenIClickToEditADifferentWard();
    ThenISeeTheEditAWardForm();
    WhenISubmitFormWithAPinConfirmationOfMoreThanFourCharacters();
    ThenISeeWardPinConfirmationLengthError();

    cy.log("displays an error when pin and ward pin confirmation is not the same")
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();
    WhenIClickOnAHospital();
    ThenISeeThePageForTheHospital();
    WhenIClickToEditADifferentWard();
    ThenISeeTheEditAWardForm();
    WhenISubmitFormWithMismatchedPins();
    ThenISeeWardPinMismatchError();

    thenIClickLogOut();
  });
  it("displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickOnAHospital();
    ThenISeeThePageForTheHospital();

    WhenIClickToEditADifferentWard();
    ThenISeeTheEditAWardForm();

    WhenISubmitFormWithoutFillingAnythingOut();
    ThenISeeAnError();

    thenIClickLogOut();
  });

  function WhenIClickToEditADifferentWard() {
    cy.get("a").contains("Edit Test Ward Two").click();
  }
  function WhenISubmitFormWithoutFillingAnythingOut() {
    cy.get("input[name=ward-name]").clear();
    cy.get("input[name=ward-pin]").clear();
    cy.get("input[name=ward-pin-confirmation]").clear();
    cy.get("button").contains("Edit ward").click();
  }
  function WhenISubmitFormWithoutFillingTheWardName() {
    cy.get("input[name=ward-name]").clear();
    cy.get("button").contains("Edit ward").click();
  }
  function WhenISubmitFormWithAPinMoreThanFourCharacters() {
    cy.get("input[name=ward-pin]").clear();
    cy.get("input[name=ward-pin]").type("abcdef");
    cy.get("button").contains("Edit ward").click();
  }
  function WhenISubmitFormWithAPinConfirmationOfMoreThanFourCharacters() {
    cy.get("input[name=ward-pin-confirmation]").clear();
    cy.get("input[name=ward-pin-confirmation]").type("abcdef");
    cy.get("button").contains("Edit ward").click();
  }
  function WhenISubmitFormWithMismatchedPins() {
    cy.get("input[name=ward-pin]").clear();
    cy.get("input[name=ward-pin]").type("1235");
    cy.get("input[name=ward-pin-confirmation]").clear();
    cy.get("input[name=ward-pin-confirmation]").type("1354");
    cy.get("button").contains("Edit ward").click();
  }
  function ThenISeeWardNameError() {
    cy.get('[data-cy=error-summary]').should("contain", "There is a problem");
    cy.get('[data-cy=error-description]').should("contain", "Enter a ward name");
  }
  function ThenISeeWardPinLengthError() {
    cy.get('[data-cy=error-summary]').should("contain", "There is a problem");
    cy.get('[data-cy=error-description] > :nth-child(1) > a').should("contain", "Ward pin is only 4 characters");
    cy.get('[data-cy=error-description] > :nth-child(2) > a').should("contain","Ward pin and pin cofirmation does not match" )
  }
  function ThenISeeWardPinConfirmationLengthError() {
    cy.get('[data-cy=error-summary]').should("contain", "There is a problem");
    cy.get('[data-cy=error-description] > :nth-child(1) > a').should("contain", "Confirmation pin is only 4 characters");
    cy.get('[data-cy=error-description] > :nth-child(2) > a').should("contain","Ward pin and pin cofirmation does not match" )
  }
  function ThenISeeWardPinMismatchError() {
    cy.get('[data-cy=error-summary]').should("contain", "There is a problem");
    cy.get('[data-cy=error-description]').should("contain", "Ward pin and pin cofirmation does not match");
  }
});
