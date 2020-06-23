describe("As a ward staff, I want to easily rebook a visit from the list screen so that I can easily book a patient in for another visit.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows a ward staff to rebook a virtual visit", () => {
    GivenIAmLoggedInAsAWardStaff();
    WhenIClickOnAVirtualVisit();
    AndIClickOnRebook();
    ThenISeeTheBookAVirtualVisitForm();

    WhenISubmitTheForm();
    ThenISeeTheCheckYourAnswersPage();

    WhenIClickBookAVirtualVisit();
    ThenISeeTheVirtualVisitIsBooked();

    WhenIClickViewVirtualVisits();
    ThenISeeTheVirtualVisitsPage();

    WhenIClickUpcomingVisits();
    ThenISeeTheBookedVirtualVisitInTheList();
  });

  function GivenIAmLoggedInAsAWardStaff() {
    cy.visit(Cypress.env("baseUrl"));
    cy.get("input").type(Cypress.env("validWard"));
    cy.get("button").contains("Log in").click();
  }

  function WhenIClickOnAVirtualVisit() {
    cy.get("summary.nhsuk-details__summary").contains("Alice").click();
  }

  function AndIClickOnRebook() {
    cy.get("summary.nhsuk-details__summary")
      .contains("Alice")
      .parent()
      .parent()
      .within(() => {
        cy.get("button").contains("Rebook").click();
      });
  }

  function ThenISeeTheBookAVirtualVisitForm() {
    cy.get("h1").should("contain", "Book a virtual visit");
  }

  function WhenISubmitTheForm() {
    cy.get("button").contains("Continue").click();
  }

  function ThenISeeTheCheckYourAnswersPage() {
    cy.get("h1").should(
      "contain",
      "Check your answers before booking a virtual visit"
    );
  }

  function WhenIClickBookAVirtualVisit() {
    cy.get("button", { timeout: cy.pageLoadTimeout })
      .contains("Book virtual visit")
      .click();
  }

  function ThenISeeTheVirtualVisitIsBooked() {
    cy.get("h1", { timeout: cy.pageLoadTimeout }).should(
      "contain",
      "Virtual visit booked"
    );
  }

  function WhenIClickViewVirtualVisits() {
    cy.get("a").contains("View virtual visits").click();
  }

  function ThenISeeTheVirtualVisitsPage() {
    cy.get("h1").should("contain", "Virtual visits");
  }

  function WhenIClickUpcomingVisits() {
    cy.get("a").contains("Upcoming").click();
  }

  function ThenISeeTheBookedVirtualVisitInTheList() {
    cy.get("summary.nhsuk-details__summary").should("contain", "Alice");
  }
});
