import { thenIClickLogOut } from "../commonSteps";

describe("As an admin, I want to log in so that I can access the service.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows an admin to log in and out", () => {
    GivenIAmAnAdmin();
    WhenIVisitTheAdminLogInPage();

    cy.audit();

    AndIEnterAValidAdminCodeAndPassword();
    AndISubmitTheForm();
    ThenISeeTheAdminHomePage();

    cy.audit();

    thenIClickLogOut();
    ThenISeeTheAdminLogInPage();
  });

  it("displays an error for an invalid code", () => {
    WhenIVisitTheAdminLogInPage();
    AndIEnterAnInvalidCode();
    AndISubmitTheForm();
    ThenISeeAnError();
  });

  it("displays an error for an invalid password", () => {
    WhenIVisitTheAdminLogInPage();
    AndIEnterAnInvalidPassword();
    AndISubmitTheForm();
    ThenISeeAnError();
  });

  function WhenIVisitTheAdminLogInPage() {
    cy.visit(Cypress.env("baseUrl") + "/admin/login");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Log in").click();
  }

  // Allows an admin to log in and out
  function GivenIAmAnAdmin() {}

  function AndIEnterAValidAdminCodeAndPassword() {
    cy.get("input[name=code]").type(Cypress.env("validAdminCode"));
    cy.get("input[name=password]").type(Cypress.env("validAdminPassword"));
  }

  function ThenISeeTheAdminHomePage() {
    cy.contains("There is a problem").should("not.be.visible");
    cy.contains("Site administration").should("be.visible");
  }

  function ThenISeeTheAdminLogInPage() {
    cy.get("h1").should("contain", "Log in to manage your site");
  }

  // Displays an error for an invalid code
  function AndIEnterAnInvalidCode() {
    cy.get("input[name=code]").type("wrong");
    cy.get("input[name=password]").type(Cypress.env("validAdminPassword"));
  }

  // Displays an error for an invalid code
  function AndIEnterAnInvalidPassword() {
    cy.get("input[name=code]").type(Cypress.env("validAdminCode"));
    cy.get("input[name=password]").type("wrong");
  }

  function ThenISeeAnError() {
    cy.contains("There is a problem").should("be.visible");
    cy.contains("The code or password you entered was not recognised").should(
      "be.visible"
    );
  }
});
