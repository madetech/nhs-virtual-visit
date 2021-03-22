import { 
  thenIClickLogOut, 
  WhenIVisitTheLandingPage, 
  AndIClickTheLinkToManageYourTrustPage,
  WhenIVisitTheManageYourTrustLoginPage,
  ThenISeeTheManageYourTrustLoginPage,
  ThenISeeTheLandingPage,
  ThenISeeAnError
} from "../commonSteps";

describe("As an admin, I want to log in so that I can access the service.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset:mssql && npm run dbmigratetest up:mssql"
    );
  });

  it("allows an admin to log in and out", () => {
    GivenIAmAnAdmin();
    WhenIVisitTheLandingPage();
    AndIClickTheLinkToManageYourTrustPage();
    ThenISeeTheManageYourTrustLoginPage();
    cy.audit();

    WhenIEnterAValidAdminEmailAndPassword();
    AndISubmitTheForm();
    ThenISeeTheAdminHomePage();

    cy.audit();

    thenIClickLogOut();
    ThenISeeTheLandingPage();
  });

  it("displays an error for an invalid email", () => {
    WhenIVisitTheManageYourTrustLoginPage();
    AndIEnterAnInvalidEmail();
    AndISubmitTheForm();
    ThenISeeAnError();
  });

  it("displays an error for an invalid password", () => {
    WhenIVisitTheManageYourTrustLoginPage();
    AndIEnterAnInvalidPassword();
    AndISubmitTheForm();
    ThenISeeAnError();
  });

  function AndISubmitTheForm() {
    cy.get("button").contains("Log in").click();
  }
  // Allows an admin to log in and out
  function GivenIAmAnAdmin() {}
  function WhenIEnterAValidAdminEmailAndPassword() {
    cy.get("input[name=email]").type(Cypress.env("validAdminEmail"));
    cy.get("input[name=password]").type(Cypress.env("validAdminPassword"));
  }
  function ThenISeeTheAdminHomePage() {
    cy.contains("There is a problem").should("not.exist");
    cy.contains("Site administration").should("be.visible");
  }
  // Displays an error for an invalid email
  function AndIEnterAnInvalidEmail() {
    cy.get("input[name=email]").type("wrong@email.com");
    cy.get("input[name=password]").type(Cypress.env("validAdminPassword"));
  }
  // Displays an error for an invalid password
  function AndIEnterAnInvalidPassword() {
    cy.get("input[name=email]").type(Cypress.env("validAdminEmail"));
    cy.get("input[name=password]").type("wrong");
  }
});
