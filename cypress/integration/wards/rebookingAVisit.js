import {
  AndIClickBookAVirtualVisit,
  GivenIAmLoggedInAsAWardStaff,
  ThenISeeTheVirtualVisitIsBooked,
} from "./wardCommonSteps";
import { thenIClickLogOut } from "../commonSteps";

describe("As a ward staff, I want to easily rebook a visit from the list screen so that I can easily book a patient in for another visit.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset:mssql && npm run dbmigratetest up:mssql"
    );
  });

  it("allows a ward staff to rebook a virtual visit", () => {
    GivenIAmLoggedInAsAWardStaff();
    WhenIClickOnAVirtualVisit();
    AndIClickOnRebook();
    ThenISeeTheBookAVirtualVisitForm();

    WhenISubmitTheForm();
    ThenISeeTheCheckYourAnswersPage();

    AndIClickBookAVirtualVisit();
    ThenISeeTheVirtualVisitIsBooked();

    WhenIClickViewVirtualVisits();
    ThenISeeTheVirtualVisitsPage();

    WhenIClickUpcomingVisits();
    ThenISeeTheBookedVirtualVisitInTheList();

    thenIClickLogOut();
  });

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
