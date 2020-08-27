import { GivenIAmLoggedInAsAWardStaff } from "./wardCommonSteps";
import { whenIClickLogOut } from "../commonSteps";

describe("As a ward staff, I want to start a virtual visit so that patients can speak with their loved ones.", () => {
  afterEach(() => {
    whenIClickLogOut();
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
    AndISeeTheVirtualVisitMarkedAsComplete();
  });

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

  function AndISeeTheVirtualVisitMarkedAsComplete() {
    cy.get("summary.nhsuk-details__summary")
      .contains("Alice")
      .should("contain", "(Complete)");
  }
});
