import { 
  WhenIVisitTheLandingPage,
  ThenISeeTheManageYourTrustLoginPage,
  ThenISeeTheLandingPage,
  AndIClickTheLinkToManageYourTrustPage
} from "../commonSteps";
describe("As a trust admin, I want to log in so that I can access the service.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset:mssql && npm run dbmigratetest up:mssql"
    );
  });

  it("allows a trust admin to log in and out", () => {
    GivenIAmATrustAdmin();
    WhenIVisitTheLandingPage();
    AndIClickTheLinkToManageYourTrustPage();
    ThenISeeTheManageYourTrustLoginPage();

    WhenIEnterAValidTrustAdminEmailAndPassword();
    AndISubmitTheForm();
    ThenISeeTheTrustAdminHomePage();
    cy.audit();

    WhenIClickLogOut();
    ThenISeeTheLandingPage();
  });

  it("displays an error for an invalid email", () => {
    WhenIVisitTheTrustAdminLogInPage();
    AndIEnterAnInvalidEmail();
    AndISubmitTheForm();
    ThenISeeAnError();
  });

  it("displays an error for an invalid password", () => {
    WhenIVisitTheTrustAdminLogInPage();
    AndIEnterAnInvalidPassword();
    AndISubmitTheForm();
    ThenISeeAnError();
  });

  function WhenIVisitTheTrustAdminLogInPage() {
    cy.visit(Cypress.env("baseUrl") + "/login");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Log in").click();
  }

  // Allows a trust admin to log in and out
  function GivenIAmATrustAdmin() {}

  function WhenIEnterAValidTrustAdminEmailAndPassword() {
    cy.get("input[name=email]").type(Cypress.env("validTrustManagerEmail"));
    cy.get("input[name=password]").type(
      Cypress.env("validTrustManagerPassword")
    );
  }
  function ThenISeeTheTrustAdminHomePage() {
    cy.get('[data-cy=trust-name]').should("contain", "Airedale NHS Foundation Trust");
    cy.get('[data-cy=layout-title]').should("contain", "Dashboard");
  }
  function WhenIClickLogOut() {
    cy.get("a.nhsuk-header__navigation-link").contains("Log out").click();
  }
  // Displays an error for an invalid code
  function AndIEnterAnInvalidEmail() {
    cy.get("input[name=email]").type("wrong@email.com");
    cy.get("input[name=password]").type(
      Cypress.env("validTrustManagerPassword")
    );
  }
  // Displays an error for an invalid password
  function AndIEnterAnInvalidPassword() {
    cy.get("input[name=email]").type(Cypress.env("validTrustManagerEmail"));
    cy.get("input[name=password]").type("wrong");
  }
  function ThenISeeAnError() {
    cy.get('[data-cy=error-summary]').should("contain", "There is a problem");
    cy.get('[data-cy=error-description]').should("contain", "The email or password you entered was not recognised");
  }
});
