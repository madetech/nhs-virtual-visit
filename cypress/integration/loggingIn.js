describe("As a user, I want to log in so that I can access the service.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows a ward staff to log in and displays their home page", () => {
    GivenIAmAWardStaff();
    WhenIVisitTheLogInPage();
    AndIEnterAValidWardCode();
    AndISubmitTheForm();
    ThenISeeTheWardHomePage();
  });

  it("allows a trust admin to log in and displays their home page", () => {
    GivenIAmATrustAdmin();
    WhenIVisitTheLogInPage();
    AndIEnterAValidTrustAdminCode();
    AndISubmitTheForm();
    ThenISeeTheTrustAdminHomePage();
  });

  it("allows an admin to log in and displays their home page", () => {
    GivenIAmAnAdmin();
    WhenIVisitTheLogInPage();
    AndIEnterAValidAdminCode();
    AndISubmitTheForm();
    ThenISeeTheAdminHomePage();
  });

  it("displays an error for an invalid code", () => {
    WhenIVisitTheLogInPage();
    AndIEnterAnInvalidCode();
    AndISubmitTheForm();
    ThenISeeAnError();
  });

  // Allows a ward staff to log in and displays their home page
  function GivenIAmAWardStaff() {}

  function WhenIVisitTheLogInPage() {
    cy.visit(Cypress.env("baseUrl"));
  }

  function AndIEnterAValidWardCode() {
    cy.get("input").type(Cypress.env("validWard"));
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Log in").click();
  }

  function ThenISeeTheWardHomePage() {
    cy.contains("The code you entered was not recognised").should(
      "not.be.visible"
    );
    cy.contains("Book a virtual visit").should("be.visible");
  }

  // Allows a trust admin to log in and displays their home page
  function GivenIAmATrustAdmin() {}

  function AndIEnterAValidTrustAdminCode() {
    cy.get("input").type(Cypress.env("validTrustAdminCode"));
  }

  function ThenISeeTheTrustAdminHomePage() {
    cy.contains("The code you entered was not recognised").should(
      "not.be.visible"
    );
    cy.contains("Test Trust").should("be.visible");
    cy.contains("Dashboard").should("be.visible");
  }

  // Allows an admin to log in and displays their home page
  function GivenIAmAnAdmin() {}

  function AndIEnterAValidAdminCode() {
    cy.get("input").type(Cypress.env("validAdminCode"));
  }

  function ThenISeeTheAdminHomePage() {
    cy.contains("The code you entered was not recognised").should(
      "not.be.visible"
    );
    cy.contains("Site administration").should("be.visible");
  }

  // Displays an error for an invalid code
  function AndIEnterAnInvalidCode() {
    cy.get("input").type(Cypress.env("fakeWard"));
  }

  function ThenISeeAnError() {
    cy.contains("There is a problem").should("be.visible");
    cy.contains("The code you entered was not recognised").should("be.visible");
  }
});
