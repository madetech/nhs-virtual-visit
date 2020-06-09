describe("As a ward staff, I want to cancel a virtual visit so that the visit cannot be started.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows a ward staff to cancel a virtual visit", () => {
    GivenIAmLoggedInAsAWardStaff();
    WhenIClickOnAVirtualVisit();
    AndIClickOnCancel();
    ThenISeeTheCancelConfirmationPage();
    AndISeeTheDetailsOfTheVirtualVisit();

    WhenIClickOnYesCancelThisVisit();
    ThenISeeTheVirtualVisitIsCancelled();

    WhenIClickReturnToVirtualVisits();
    ThenIDoNotSeeTheVirtualVisit();
  });

  function GivenIAmLoggedInAsAWardStaff() {
    cy.visit(Cypress.env("baseUrl"));
    cy.get("input").type(Cypress.env("validWard"));
    cy.get("button").contains("Log in").click();
  }

  function WhenIClickOnAVirtualVisit() {
    cy.get("summary.nhsuk-details__summary").contains("Alice").click();
  }

  function AndIClickOnCancel() {
    cy.get("summary.nhsuk-details__summary")
      .contains("Alice")
      .parent()
      .parent()
      .within(() => {
        cy.get("button").contains("Cancel").click();
      });
  }

  function ThenISeeTheCancelConfirmationPage() {
    cy.get("h1").should(
      "contain",
      "Are you sure you want to cancel this visit?"
    );
  }

  function AndISeeTheDetailsOfTheVirtualVisit() {
    cy.contains("bob@example.com").should("be.visible");
  }

  function WhenIClickOnYesCancelThisVisit() {
    cy.get("button").contains("Yes, cancel this visit").click();
  }

  function ThenISeeTheVirtualVisitIsCancelled() {
    cy.get("h1").should("contain", "Virtual visit cancelled");
  }

  function WhenIClickReturnToVirtualVisits() {
    cy.get("a").contains("Return to virtual visits").click();
  }

  function ThenIDoNotSeeTheVirtualVisit() {
    cy.get("summary.nhsuk-details__summary").should("not.contain", "Alice");
  }
});
