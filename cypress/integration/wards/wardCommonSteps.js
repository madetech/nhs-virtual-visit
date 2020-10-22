function ThenISeeTheBookAVirtualVisitForm() {
  cy.get("h1").should("contain", "Book a virtual visit");
}

function ThenISeeTheCheckYourAnswersPage() {
  cy.get("h1").should(
    "contain",
    "Check your answers before booking a virtual visit"
  );
}

function ThenISeeTheCheckYourEditsPage() {
  cy.get("h1").should(
    "contain",
    "Check your answers before editing a virtual visit"
  );
}

function ThenISeeTheVirtualVisitIsBooked() {
  cy.get(`[data-testid=virtual-visit-booked]`);
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
  cy.get(`[data-testid=details-summary-${name}]`).click();
}

function WhenIClickReturnToVirtualVisits() {
  cy.get("a").contains("Return to virtual visits").click();
}

function AndIClickBookAVirtualVisit() {
  cy.get(`[data-testid=book-virtual-visit]`).click();
}

module.exports = {
  ThenISeeTheBookAVirtualVisitForm,
  ThenISeeTheCheckYourAnswersPage,
  ThenISeeTheCheckYourEditsPage,
  ThenISeeTheVirtualVisitIsBooked,
  WhenIClickViewVirtualVisits,
  ThenISeeTheVirtualVisitsPage,
  GivenIAmLoggedInAsAWardStaff,
  WhenIClickOnAVirtualVisit,
  WhenIClickReturnToVirtualVisits,
  AndIClickBookAVirtualVisit,
};
