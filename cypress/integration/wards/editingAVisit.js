describe("As a ward staff, I want to edit a visit from the list screen so that I can change the details of a visit.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows a ward staff to edit a virtual visit", () => {
    GivenIAmLoggedInAsAWardStaff();
    WhenIClickOnAVirtualVisit();
    AndIClickOnEdit();
    ThenISeeTheEditAVirtualVisitForm();

    WhenIEditTheVisit();
    AndISubmitTheForm();
    ThenISeeTheCheckYourAnswersPage();

    WhenIClickBookAVirtualVisit();
    ThenISeeTheVirtualVisitIsUpdated();

    WhenIClickViewVirtualVisits();
    ThenISeeTheVirtualVisitsPage();
    AndISeeTheEditedVirtualVisitInTheList();
  });

  it("displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsAWardStaff();
    WhenIClickOnAnotherVirtualVisit();
    AndIClickOnEditForAnotherVirtualVisit();
    ThenISeeTheEditAVirtualVisitForm();

    WhenISubmitFormWithBlankFields();
    ThenISeeErrors();
  });

  // Allows a ward staff to edit a virtual visit
  function GivenIAmLoggedInAsAWardStaff() {
    cy.visit(Cypress.env("baseUrl"));
    cy.get("input").type(Cypress.env("validWard"));
    cy.get("button").contains("Log in").click();
  }

  function WhenIClickOnAVirtualVisit() {
    cy.get("summary.nhsuk-details__summary").contains("Alice").click();
  }

  function AndIClickOnEdit() {
    cy.get("summary.nhsuk-details__summary")
      .contains("Alice")
      .parent()
      .parent()
      .within(() => {
        cy.get("button").contains("Edit").click();
      });
  }

  function ThenISeeTheEditAVirtualVisitForm() {
    cy.get("h1").should("contain", "Edit a virtual visit");
  }

  function WhenIEditTheVisit() {
    cy.get("input[name=patient-name]").clear();
    cy.get("input[name=patient-name]").type("Catra");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Continue").click();
  }

  function ThenISeeTheCheckYourAnswersPage() {
    cy.get("h1").should(
      "contain",
      "Check your answers before editing a virtual visit"
    );
  }

  function WhenIClickBookAVirtualVisit() {
    cy.get("button", { timeout: cy.pageLoadTimeout })
      .contains("Book virtual visit")
      .click();
  }

  function ThenISeeTheVirtualVisitIsUpdated() {
    cy.get("h1", { timeout: cy.pageLoadTimeout }).should(
      "contain",
      "Virtual visit has been updated"
    );
  }

  function WhenIClickViewVirtualVisits() {
    cy.get("a").contains("Return to virtual visits").click();
  }

  function ThenISeeTheVirtualVisitsPage() {
    cy.get("h1").should("contain", "Virtual visits");
  }

  function AndISeeTheEditedVirtualVisitInTheList() {
    cy.get("summary.nhsuk-details__summary").should("contain", "Catra");
  }

  // Displays errors when fields have been left blank
  function WhenIClickOnAnotherVirtualVisit() {
    cy.get("summary.nhsuk-details__summary").contains("Elliot").click();
  }

  function AndIClickOnEditForAnotherVirtualVisit() {
    cy.get("summary.nhsuk-details__summary")
      .contains("Elliot")
      .parent()
      .parent()
      .within(() => {
        cy.get("button").contains("Edit").click();
      });
  }

  function WhenISubmitFormWithBlankFields() {
    cy.get("input[name=patient-name]").clear();
    cy.get("input[name=contact-name]").clear();
    cy.get("button").contains("Continue").click();
  }

  function ThenISeeErrors() {
    cy.contains("There is a problem").should("be.visible");
  }
});
