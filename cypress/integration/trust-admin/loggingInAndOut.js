describe("As a trust admin, I want to log in so that I can access the service.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows a trust admin to log in and out", () => {
    GivenIAmATrustAdmin();
    WhenIVisitTheTrustAdminLogInPage();
    cy.audit();

    AndIEnterAValidTrustAdminCodeAndPassword();
    AndISubmitTheForm();
    ThenISeeTheTrustAdminHomePage();
    cy.audit();

    WhenIClickLogOut();
    ThenISeeTheTrustAdminLogInPage();
  });

  it("displays an error for an invalid code", () => {
    WhenIVisitTheTrustAdminLogInPage();
    AndIEnterAnInvalidCode();
    AndISubmitTheForm();
    ThenISeeAnError();
  });

  it("allows a trust admin to log in and out when the ward code and trust admin code are the same", () => {
    GivenTheSameWardCodeAsAdminCode();
    GivenIAmATrustAdmin();
    WhenIVisitTheTrustAdminLogInPage();
    cy.audit();

    AndIEnterAValidTrustAdminCodeAndPassword();
    AndISubmitTheForm();
    ThenISeeTheTrustAdminHomePage();
    cy.audit();

    WhenIClickLogOut();
    ThenISeeTheTrustAdminLogInPage();
  });

  it("displays an error for an invalid password", () => {
    WhenIVisitTheTrustAdminLogInPage();
    AndIEnterAnInvalidPassword();
    AndISubmitTheForm();
    ThenISeeAnError();
  });

  function GivenTheSameWardCodeAsAdminCode() {}

  function WhenIVisitTheTrustAdminLogInPage() {
    cy.visit(Cypress.env("baseUrl") + "/trust-admin/login");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Log in").click();
  }

  // Allows a trust admin to log in and out
  function GivenIAmATrustAdmin() {}

  function AndIEnterAValidTrustAdminCodeAndPassword() {
    cy.get("input[name=code]").type(Cypress.env("validTrustAdminCode"));
    cy.get("input[name=password]").type(Cypress.env("validTrustAdminPassword"));
  }

  function ThenISeeTheTrustAdminHomePage() {
    cy.contains("There is a problem").should("not.be.visible");
    cy.contains("Test Trust").should("be.visible");
    cy.contains("Dashboard").should("be.visible");
  }

  function WhenIClickLogOut() {
    cy.get("a.nhsuk-header__navigation-link").contains("Log out").click();
  }

  function ThenISeeTheTrustAdminLogInPage() {
    cy.get("h1").should("contain", "Log in to manage your trust");
  }

  // Displays an error for an invalid code
  function AndIEnterAnInvalidCode() {
    cy.get("input[name=code]").type("wrong");
    cy.get("input[name=password]").type(Cypress.env("validTrustAdminPassword"));
  }

  // Displays an error for an invalid code
  function AndIEnterAnInvalidPassword() {
    cy.get("input[name=code]").type(Cypress.env("validTrustAdminCode"));
    cy.get("input[name=password]").type("wrong");
  }

  function ThenISeeAnError() {
    cy.contains("There is a problem").should("be.visible");
    cy.contains("The code or password you entered was not recognised").should(
      "be.visible"
    );
  }
});
