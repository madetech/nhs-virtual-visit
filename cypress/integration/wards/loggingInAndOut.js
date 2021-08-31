import { 
  WhenIVisitTheLandingPage,
  ThenISeeTheLandingPage, 
} from "../commonSteps";

describe("As a ward staff, I want to log in so that I can access the service.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset:mssql && npm run dbmigratetest up:mssql"
    );
  });

  it("allows a ward staff to log in and out", () => {
    GivenIAmAWardStaff();
    WhenIVisitTheLandingPage();
    AndIClickTheLinkToBookAVisitLoginPage();
    ThenISeeTheWardStaffLogInPage();

    WhenIEnterAValidWardCodeAndPin();
    AndISubmitTheForm();
    ThenISeeTheWardHomePage();

    WhenIClickLogOut();
    ThenISeeTheLandingPage();
    cy.audit();
  });

  it("displays an error for an invalid code", () => {
    WhenIVisitTheLogInPage();
    AndIEnterAnInvalidCode();
    AndISubmitTheForm();
    ThenISeeAnError();
  });
  it("displays an error if an invalid pin is entered", () => {
    WhenIVisitTheLogInPage();
    AndIEnterAnInvalidPin();
    AndISubmitTheForm();
    ThenISeeAnError();
  });

  // Allows a ward staff to log in and out
  function GivenIAmAWardStaff() {}

  function WhenIEnterAValidWardCodeAndPin() {
    cy.get("input[name=code]").type(Cypress.env("validWardCode"));
    cy.get("input[name=pin]").type(Cypress.env("validWardPin"));
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Log in").click();
  }

  function ThenISeeTheWardHomePage() {
    cy.contains("The code you entered was not recognised").should("not.exist");
    cy.get("h1").should("contain", "Virtual visits");
  }

  function WhenIClickLogOut() {
    cy.get("a.nhsuk-header__navigation-link").contains("Log out").click();
  }

  function ThenISeeTheWardStaffLogInPage() {
    cy.get("h1").should("contain", "Log in to book a virtual visit");
  }
  function WhenIVisitTheLogInPage() {
    cy.visit(Cypress.env("baseUrl") + "/wards/login");
  }
  // Displays an error for an invalid code
  function AndIEnterAnInvalidCode() {
    cy.get("input[name=code]").type(Cypress.env("fakeWard"));
    cy.get("input[name=pin]").type(Cypress.env("validWardPin"));
  }

  function AndIEnterAnInvalidPin() {
    cy.get("input[name=code]").type(Cypress.env("validWardPin"));
    cy.get("input[name=pin]").type("invalid pin");
  }

  function AndIClickTheLinkToBookAVisitLoginPage(){
    cy.get('[data-cy=ward-book-a-visit-link] > .nhsuk-link').click();
  }

  function ThenISeeAnError() {
    cy.get('[data-cy=error-summary]').should("contain", "There is a problem");
    cy.get('[data-cy=error-description]').should("contain", "The code or pin you entered was not recognised");
  }
});