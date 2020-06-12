describe.skip("As a ward staff, I want to start a virtual visit so that patients can speak with their loved ones.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows a ward staff to start a virtual visit", () => {
    GivenIAmLoggedInAsAWardStaff();
    WhenIClickOnAVirtualVisit();
    AndIClickOnStart();
    ThenISeeTheBeforeStartingAVirtualVisitPage();

    WhenIClickOnAttendVisit();
    ThenISeeAVideoFrame();
    AndISeeAnEndCallButton();

    WhenIClickOnEndCall();
    ThenISeeTheVirtualVisitIsCompleted();

    WhenIClickToReturnToVirtualVisits();
    ThenISeeTheVirtualVisitsPage();
  });

  // Allows a ward staff to start a virtual visit
  function GivenIAmLoggedInAsAWardStaff() {
    cy.visit(Cypress.env("baseUrl"));
    cy.get("input").type(Cypress.env("validWard"));
    cy.get("button").contains("Log in").click();
  }

  function WhenIClickOnAVirtualVisit() {
    cy.get("summary.nhsuk-details__summary").contains("Alice").click();
  }

  function AndIClickOnStart() {
    cy.get("summary.nhsuk-details__summary")
      .contains("Alice")
      .parent()
      .parent()
      .within(() => {
        cy.get("button").contains("Start").click();
      });
  }

  function ThenISeeTheBeforeStartingAVirtualVisitPage() {
    cy.get("h1").should("contain", "Before handing over to the patient");
  }

  function WhenIClickOnAttendVisit() {
    cy.get("button").contains("Attend visit").click();
  }

  function ThenISeeAVideoFrame() {
    cy.get("iframe", { timeout: cy.pageLoadTimeOut }).should("be.visible");
  }

  function AndISeeAnEndCallButton() {
    cy.get("button").contains("End call").should("be.visible");
  }

  function WhenIClickOnEndCall() {
    cy.get("button").contains("End call").click();
  }

  function ThenISeeTheVirtualVisitIsCompleted() {
    cy.get("h1").should("contain", "Your virtual visit has completed");
  }

  function WhenIClickToReturnToVirtualVisits() {
    cy.get("a").contains("Return to virtual visits").click();
  }

  function ThenISeeTheVirtualVisitsPage() {
    cy.get("h1").should("contain", "Virtual visits");
  }
});
