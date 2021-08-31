import { GivenIAmLoggedInAsAWardStaff } from "./wardCommonSteps";
import { ThenISeeAnError } from "../commonSteps";
describe("As a ward staff, I want to edit a visit from the list screen so that I can change the details of a visit.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset:mssql && npm run dbmigratetest up:mssql"
    );
  });

  it("allows a ward staff to edit a virtual visit", () => {
    GivenIAmLoggedInAsAWardStaff();
    WhenIClickOnAVirtualVisit();
    AndIClickOnEdit();
    ThenISeeTheEditAVirtualVisitForm();
    cy.audit();

    WhenIEditTheVisit();
    AndISubmitTheForm();
    ThenISeeTheCheckYourAnswersPage();

    WhenIClickEditAVirtualVisit();
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
    ThenISeeAnError();
  });

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

  function WhenIClickEditAVirtualVisit() {
    cy.get("[data-testid=save-and-continue]").click();
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
});
