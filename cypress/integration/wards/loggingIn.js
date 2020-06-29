describe("As a ward staff, I want to log in so that I can access the service.", () => {
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

  // Displays an error for an invalid code
  function AndIEnterAnInvalidCode() {
    cy.get("input").type(Cypress.env("fakeWard"));
  }

  function ThenISeeAnError() {
    cy.contains("There is a problem").should("be.visible");
    cy.contains("The code you entered was not recognised").should("be.visible");
  }
});
