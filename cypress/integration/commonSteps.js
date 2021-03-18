function thenIClickLogOut() {
  cy.get("a.nhsuk-header__navigation-link").contains("Log out").click();
}

function WhenIVisitTheLandingPage() {
  cy.visit(Cypress.env("baseUrl"));
}

function AndIClickTheLinkToManageYourTrustPage(){
  cy.get('[data-cy=admin-and-manager-login-link] > .nhsuk-link').click();
}

function WhenIVisitTheManageYourTrustLoginPage() {
  cy.visit(Cypress.env("baseUrl") + "/login");
}

function ThenIVisitTheManageYourTrustLoginPage() {
  WhenIVisitTheManageYourTrustLoginPage();
}

function ThenISeeTheManageYourTrustLoginPage() {
  cy.get('[data-cy=page-heading]').should("contain", "Log in to manage your site");
}

function ThenISeeTheLandingPage() {
  cy.get('[data-cy=page-heading]').should("contain", "NHS Virtual Visit");
}

function ThenISeeAnError() {
  cy.get('[data-cy=error-summary]').should("contain", "There is a problem");
}

module.exports = {
  thenIClickLogOut,
  WhenIVisitTheLandingPage,
  AndIClickTheLinkToManageYourTrustPage,
  ThenIVisitTheManageYourTrustLoginPage,
  WhenIVisitTheManageYourTrustLoginPage,
  ThenISeeTheManageYourTrustLoginPage,
  ThenISeeTheLandingPage,
  ThenISeeAnError,
};
