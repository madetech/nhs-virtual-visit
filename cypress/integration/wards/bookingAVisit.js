import { whenIClickLogOut } from "../commonSteps";
import {
  GivenIAmLoggedInAsAWardStaff,
  ThenISeeTheBookAVirtualVisitForm,
  ThenISeeTheCheckYourAnswersPage,
  ThenISeeTheVirtualVisitIsBooked,
  ThenISeeTheVirtualVisitsPage,
  WhenIClickViewVirtualVisits,
} from "./wardCommonSteps";

describe("As a ward staff, I want to schedule a virtual visit so that patients can speak with their loved ones.", () => {
  after(() => {
    whenIClickLogOut();
  });

  it("allows a ward staff to book a virtual visit", () => {
    cy.log("* 1 bookingAVisit integration test ***", new Date().toISOString());
    GivenIAmLoggedInAsAWardStaff();
    cy.log("* 2 bookingAVisit integration test ***", new Date().toISOString());
    WhenIClickBookAVirtualVisitOnTheNavigationBar();
    cy.log("* 3 bookingAVisit integration test ***", new Date().toISOString());
    ThenISeeTheBeforeBookingAVisitPage();
    cy.audit();

    WhenIClickStartNow();
    cy.log("* 4 bookingAVisit integration test ***", new Date().toISOString());
    ThenISeeTheBookAVirtualVisitForm();
    cy.log("* 5 bookingAVisit integration test ***", new Date().toISOString());
    cy.audit();

    WhenIFillOutTheForm();
    cy.log("* 6 bookingAVisit integration test ***", new Date().toISOString());
    AndISubmitTheForm();
    cy.log("* 7 bookingAVisit integration test ***", new Date().toISOString());
    ThenISeeTheCheckYourAnswersPage();
    cy.log("* 8 bookingAVisit integration test ***", new Date().toISOString());
    cy.audit();

    WhenIClickChange();
    cy.log("* 9 bookingAVisit integration test ***", new Date().toISOString());
    ThenISeeTheBookAVirtualVisitForm();
    cy.log("* 10 bookingAVisit integration test ***", new Date().toISOString());

    WhenISubmitTheForm();
    cy.log("* 11 bookingAVisit integration test ***", new Date().toISOString());
    ThenISeeTheCheckYourAnswersPage();
    cy.audit();
    cy.log("* 12 bookingAVisit integration test ***", new Date().toISOString());
    AndIClickBookAVirtualVisit();
    cy.log("* 13 bookingAVisit integration test ***", new Date().toISOString());
    ThenISeeTheVirtualVisitIsBooked();
    cy.audit();
    cy.log("* 14 bookingAVisit integration test ***", new Date().toISOString());

    WhenIClickViewVirtualVisits();
    cy.log("* 15 bookingAVisit integration test ***", new Date().toISOString());
    ThenISeeTheVirtualVisitsPage();
    cy.audit();
    cy.log("* 16 bookingAVisit integration test ***", new Date().toISOString());
    AndISeeTheBookedVirtualVisitInTheList();
    cy.log("* 17 bookingAVisit integration test ***", new Date().toISOString());
  });

  it("displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsAWardStaff();
    WhenIClickBookAVirtualVisitOnTheNavigationBar();
    ThenISeeTheBeforeBookingAVisitPage();

    WhenIClickStartNow();
    ThenISeeTheBookAVirtualVisitForm();

    WhenISubmitFormWithoutFillingAnythingOut();
    ThenISeeErrors();
  });

  function WhenIClickBookAVirtualVisitOnTheNavigationBar() {
    cy.get("a.nhsuk-header__navigation-link")
      .contains("Book a virtual visit")
      .click();
  }

  function ThenISeeTheBeforeBookingAVisitPage() {
    cy.contains("Before booking a virtual visit").should("be.visible");
  }

  function WhenIClickStartNow() {
    cy.get("a.nhsuk-button").contains("Start now").click();
  }

  function WhenIFillOutTheForm() {
    cy.get("input[name=patient-name]").type("Adora");
    cy.get("input[name=contact-name]").type("Catra");
    cy.get("input[name=email-checkbox]").click();
    cy.get("input[name=email-address]").type("catra@example.com");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Continue").click();
  }

  function WhenIClickChange() {
    cy.get("a").contains("Change").click();
  }

  function WhenISubmitTheForm() {
    cy.get("button").contains("Continue").click();
  }

  function AndIClickBookAVirtualVisit() {
    cy.get("button", { timeout: cy.pageLoadTimeout })
      .contains("Book virtual visit")
      .click();
  }

  function AndISeeTheBookedVirtualVisitInTheList() {
    cy.get("summary.nhsuk-details__summary").should("contain", "Adora");
  }

  // Displays errors when fields have been left blank
  function WhenISubmitFormWithoutFillingAnythingOut() {
    cy.get("button").contains("Continue").click();
  }

  function ThenISeeErrors() {
    cy.contains("There is a problem").should("be.visible");
  }
});
