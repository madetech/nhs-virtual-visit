function ThenISeeTheBookAVirtualVisitForm() {
  cy.get("h1").should("contain", "Book a virtual visit");
}

function ThenISeeTheCheckYourAnswersPage() {
  cy.get("h1").should(
    "contain",
    "Check your answers before booking a virtual visit"
  );
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

// Allows a ward staff to book a virtual visit
function GivenIAmLoggedInAsAWardStaff() {
  cy.visit(Cypress.env("baseUrl"));
  cy.get("input").type(Cypress.env("validWard"));
  cy.get("button").contains("Log in").click();
}

function WhenIClickOnAVirtualVisit(name) {
  cy.get("summary.nhsuk-details__summary").contains(name).click();
}

function WhenIClickReturnToVirtualVisits() {
  cy.get("a").contains("Return to virtual visits").click();
}

module.exports = {
  ThenISeeTheBookAVirtualVisitForm,
  ThenISeeTheCheckYourAnswersPage,
  ThenISeeTheVirtualVisitIsBooked,
  WhenIClickViewVirtualVisits,
  ThenISeeTheVirtualVisitsPage,
  GivenIAmLoggedInAsAWardStaff,
  WhenIClickOnAVirtualVisit,
  WhenIClickReturnToVirtualVisits,
};
