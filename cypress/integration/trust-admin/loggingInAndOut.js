describe("As a trust admin, I want to log in so that I can access the service.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
    cy.exec("npm run dbmigrate-test-mssql up:mssql");
  });

  it("allows a trust admin to log in and out", () => {
    GivenIAmATrustAdmin();
    WhenIVisitTheTrustAdminLogInPage();
    cy.audit();

    AndIEnterAValidTrustAdminEmailAndPassword();
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

    AndIEnterAValidTrustAdminEmailAndPassword();
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
    cy.visit(Cypress.env("baseUrl") + "/login");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Log in").click();
  }

  // Allows a trust admin to log in and out
  function GivenIAmATrustAdmin() {}

  function AndIEnterAValidTrustAdminEmailAndPassword() {
    cy.get("input[name=email]").type(Cypress.env("validTrustAdminCode"));
    cy.get("input[name=password]").type(Cypress.env("validTrustAdminPassword"));
  }

  function ThenISeeTheTrustAdminHomePage() {
    cy.contains("There is a problem").should("not.exist");
    cy.contains("Airedale NHS Foundation Trust").should("be.visible");
    cy.contains("Dashboard").should("be.visible");
  }

  function WhenIClickLogOut() {
    cy.get("a.nhsuk-header__navigation-link").contains("Log out").click();
  }

  function ThenISeeTheTrustAdminLogInPage() {
    cy.get("h1.nhsuk-heading-xl").contains("Log in to manage your site");
  }

  // Displays an error for an invalid code
  function AndIEnterAnInvalidCode() {
    cy.get("input[name=email]").type("wrong@email.com");
    cy.get("input[name=password]").type(Cypress.env("validTrustAdminPassword"));
  }

  // Displays an error for an invalid code
  function AndIEnterAnInvalidPassword() {
    cy.get("input[name=email]").type(Cypress.env("validTrustAdminCode"));
    cy.get("input[name=password]").type("wrong");
  }

  function ThenISeeAnError() {
    cy.get(".nhsuk-error-summary").should("exist");
    cy.get("#error-summary-title").contains("There is a problem");
    cy.get("li > a").contains(
      "The email or password you entered was not recognised"
    );
  }
});
