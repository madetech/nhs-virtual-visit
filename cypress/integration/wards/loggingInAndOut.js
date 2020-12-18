describe("As a ward staff, I want to log in so that I can access the service.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows a ward staff to log in and out", () => {
    GivenIAmAWardStaff();
    WhenIVisitTheLogInPage();
    cy.audit();
    AndIEnterAValidWardCode();
    AndISubmitTheForm();
    ThenISeeTheWardHomePage();

    WhenIClickLogOut();
    ThenISeeTheWardStaffLogInPage();
    cy.audit();
  });

  it("displays an error for an invalid code", () => {
    WhenIVisitTheLogInPage();
    AndIEnterAnInvalidCode();
    AndISubmitTheForm();
    ThenISeeAnError();
  });

  // Allows a ward staff to log in and out
  function GivenIAmAWardStaff() {}

  function WhenIVisitTheLogInPage() {
    cy.visit(Cypress.env("baseUrl"));
    cy.audit();
  }

  function AndIEnterAValidWardCode() {
    cy.get("input").type(Cypress.env("validWard"));
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

  // Displays an error for an invalid code
  function AndIEnterAnInvalidCode() {
    cy.get("input").type(Cypress.env("fakeWard"));
  }

  function ThenISeeAnError() {
    cy.contains("There is a problem").should("be.visible");
    cy.contains("The code you entered was not recognised").should("be.visible");
  }
});
