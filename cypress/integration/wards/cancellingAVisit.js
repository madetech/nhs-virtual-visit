import {
  GivenIAmLoggedInAsAWardStaff,
  WhenIClickOnAVirtualVisit,
  WhenIClickReturnToVirtualVisits,
} from "./wardCommonSteps";
import { whenIClickLogOut } from "../commonSteps";

describe("As a ward staff, I want to cancel a virtual visit so that the visit cannot be started.", () => {
  after(() => {
    whenIClickLogOut();
  });

  it("allows a ward staff to cancel a virtual visit", () => {
    GivenIAmLoggedInAsAWardStaff();
    WhenIClickOnAVirtualVisit();
    AndIClickOnCancel();
    ThenISeeTheCancelConfirmationPage();
    cy.audit();
    AndISeeTheDetailsOfTheVirtualVisit();

    WhenIClickOnYesCancelThisVisit();
    ThenISeeTheVirtualVisitIsCancelled();
    cy.audit();
    WhenIClickReturnToVirtualVisits();
    ThenIDoNotSeeTheVirtualVisit();
  });

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

  function ThenIDoNotSeeTheVirtualVisit() {
    cy.get("summary.nhsuk-details__summary").should("not.contain", "Alice");
  }
});
