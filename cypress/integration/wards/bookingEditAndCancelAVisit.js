import { thenIClickLogOut } from "../commonSteps";
import {
  AndIClickBookAVirtualVisit,
  GivenIAmLoggedInAsAWardStaff,
  ThenISeeTheBookAVirtualVisitForm,
  ThenISeeTheCheckYourAnswersPage,
  ThenISeeTheCheckYourEditsPage,
  ThenISeeTheVirtualVisitIsBooked,
  ThenISeeTheVirtualVisitsPage,
  WhenIClickOnAVirtualVisit,
  WhenIClickReturnToVirtualVisits,
  WhenIClickViewVirtualVisits,
} from "./wardCommonSteps";

describe("As a ward staff, I want to schedule a virtual visit so that patients can speak with their loved ones.", () => {
  const first = "Adora";
  const newFirstName = "Catra";

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

    WhenIFillOutTheBookAVisitForm(first);
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
    AndISeeTheBookedVirtualVisitInTheList(first);
    cy.log("* 17 bookingAVisit integration test ***", new Date().toISOString());

    thenIClickLogOut();
  });

  it("displays errors when fields have been left blank when creating a visit", () => {
    GivenIAmLoggedInAsAWardStaff();
    WhenIClickBookAVirtualVisitOnTheNavigationBar();
    ThenISeeTheBeforeBookingAVisitPage();

    WhenIClickStartNow();
    ThenISeeTheBookAVirtualVisitForm();

    WhenISubmitFormWithoutFillingAnythingOut();
    ThenISeeErrors();

    thenIClickLogOut();
  });

  it("allows a ward staff to edit a virtual visit", () => {
    GivenIAmLoggedInAsAWardStaff();
    WhenIClickOnAVirtualVisit(first);
    AndIClickOnEdit(first);
    ThenISeeTheEditAVirtualVisitForm();
    cy.audit();

    WhenIEditTheVisit(newFirstName);
    AndISubmitTheForm();
    ThenISeeTheCheckYourEditsPage();

    WhenIClickEditAVirtualVisit();
    ThenISeeTheVirtualVisitIsUpdated();

    WhenIClickReturnToVirtualVisits();
    ThenISeeTheVirtualVisitsPage();
    AndISeeTheEditedVirtualVisitInTheList(newFirstName);

    thenIClickLogOut();
  });

  it("displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsAWardStaff();
    WhenIClickOnAnotherVirtualVisit("Elliot");
    AndIClickOnEditForAnotherVirtualVisit("Elliot");
    ThenISeeTheEditAVirtualVisitForm();

    WhenISubmitFormWithBlankFields();
    ThenISeeErrors();

    thenIClickLogOut();
  });

  it("allows a ward staff to cancel a virtual visit", () => {
    GivenIAmLoggedInAsAWardStaff();
    WhenIClickOnAVirtualVisit(newFirstName);
    AndIClickOnCancel(newFirstName);
    ThenISeeTheCancelConfirmationPage();
    cy.audit();
    AndISeeTheDetailsOfTheVirtualVisit();

    WhenIClickOnYesCancelThisVisit();
    ThenISeeTheVirtualVisitIsCancelled();
    cy.audit();
    WhenIClickReturnToVirtualVisits();
    ThenIDoNotSeeTheVirtualVisit(newFirstName);

    thenIClickLogOut();
  });

  function WhenIClickOnYesCancelThisVisit() {
    cy.get("button").contains("Yes, cancel this visit").click();
  }

  function ThenISeeTheVirtualVisitIsCancelled() {
    cy.get("h1").should("contain", "Virtual visit cancelled");
  }

  function ThenIDoNotSeeTheVirtualVisit(firstName) {
    cy.get("summary.nhsuk-details__summary").should("not.contain", firstName);
  }

  function AndISeeTheDetailsOfTheVirtualVisit() {
    cy.contains("bob@example.com").should("be.visible");
  }

  function ThenISeeTheCancelConfirmationPage() {
    cy.get("h1").should(
      "contain",
      "Are you sure you want to cancel this visit?"
    );
  }

  function AndIClickOnCancel(name) {
    cy.get("summary.nhsuk-details__summary")
      .contains(name)
      .parent()
      .parent()
      .within(() => {
        cy.get("button").contains("Cancel").click();
      });
  }

  function WhenISubmitFormWithBlankFields() {
    cy.get("input[name=patient-name]").clear();
    cy.get("input[name=contact-name]").clear();
    cy.get("button").contains("Continue").click();
  }

  function AndIClickOnEditForAnotherVirtualVisit(name) {
    cy.get("summary.nhsuk-details__summary")
      .contains(name)
      .parent()
      .parent()
      .within(() => {
        cy.get("button").contains("Edit").click();
      });

    // cy.get("[data-testid=edit-ward-button]").click();
  }

  function WhenIClickOnAnotherVirtualVisit(name) {
    cy.get(`[data-testid=details-summary-${name}]`).click();
  }

  function AndISeeTheEditedVirtualVisitInTheList(name) {
    cy.get("summary.nhsuk-details__summary").should("contain", name);
  }

  function ThenISeeTheVirtualVisitIsUpdated() {
    cy.contains("Virtual visit has been updated");
  }

  function WhenIClickEditAVirtualVisit() {
    cy.get("[data-testid=edit-button]").click();
  }

  function WhenIEditTheVisit(firstName) {
    cy.get("input[name=patient-name]").clear();
    cy.get("input[name=patient-name]").type(firstName);
  }

  function ThenISeeTheEditAVirtualVisitForm() {
    cy.get("h1").should("contain", "Edit a virtual visit");
  }

  function AndIClickOnEdit(firstName) {
    cy.get(`[data-testid=details-summary-${firstName}]`).click();

    cy.get(`[data-testid=edit-visit-button-${firstName}]`).click();
  }

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

  function WhenIFillOutTheBookAVisitForm(patientName) {
    cy.get("input[name=patient-name]").type(patientName);
    cy.get("input[name=contact-name]").type("contact name");
    cy.get("input[name=email-checkbox]").click();
    cy.get("input[name=email-address]").type("bob@example.com");
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

  function AndISeeTheBookedVirtualVisitInTheList(patientName) {
    cy.get("summary.nhsuk-details__summary").should("contain", patientName);
  }

  // Displays errors when fields have been left blank
  function WhenISubmitFormWithoutFillingAnythingOut() {
    cy.get("button").contains("Continue").click();
  }

  function ThenISeeErrors() {
    cy.contains("There is a problem").should("be.visible");
  }
});
