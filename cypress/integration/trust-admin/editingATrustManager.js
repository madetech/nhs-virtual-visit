import { thenIClickLogOut } from "../commonSteps";

describe("As an admin, I want to edit a trust manager so that I can keep trust manager changes up to date.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows admin to edit the status of trust manager", () => {
    GivenIAmLoggedInAsAnAdmin();
    WhenIClickOnTrustManagersOnTheNavigationBar();
    ThenISeeTheTrustManagersList();
    WhenIClickOnTheEditLink();
    ThenISeeAnEditTrustManagerForm();
    WhenIFillOutTheEditTMForm("disabled");
    AndIClickTheEditTrustManagerButton();
    ThenISeeTheTrustManagerIsUpdatedPage();
    cy.audit();

    WhenIClickOnTrustManagersOnTheNavigationBar();
    ThenISeeTheTrustManagersList();
    WhenIClickOnTheEditLink();
    ThenISeeAnEditTrustManagerForm();
    WhenIFillOutTheEditTMForm("active");
    AndIClickTheEditTrustManagerButton();
    ThenISeeTheTrustManagerIsUpdatedPage();
    thenIClickLogOut();
  });

  function GivenIAmLoggedInAsAnAdmin() {
    cy.visit(Cypress.env("baseUrl") + "/trust-admin/login");
    cy.get("input[name=code]").type(Cypress.env("validTrustAdminCode"));
    cy.get("input[name=password]").type(Cypress.env("validTrustAdminPassword"));
    cy.get("button").contains("Log in").click();
  }

  function WhenIClickOnTrustManagersOnTheNavigationBar() {
    cy.get("a.nhsuk-header__navigation-link")
      .contains("Trust Managers")
      .click();
  }

  function ThenISeeTheTrustManagersList() {
    cy.get("caption").should("contain", "List of Trust Managers");
  }

  function WhenIClickOnTheEditLink() {
    cy.get("a.nhsuk-link").contains("Edit").click();
  }

  function ThenISeeAnEditTrustManagerForm() {
    cy.get("#tm-form-heading").contains("Edit a Trust Manager");
  }

  function WhenIFillOutTheEditTMForm(status) {
    cy.get("#tm-select-status").select(status);
  }
  function AndIClickTheEditTrustManagerButton() {
    cy.get("button[type=submit]").contains("Edit a Trust Manager").click();
  }

  function ThenISeeTheTrustManagerIsUpdatedPage() {
    cy.get("#panel-updated-success").contains("has been updated");
  }
});
