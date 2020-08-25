const GivenIAmLoggedInAsATrustAdmin = () => {
  cy.visit(Cypress.env("baseUrl") + "/trust-admin/login");

  cy.get("input[name=code]").type(Cypress.env("validTrustAdminCode"));
  cy.get("input[name=password]").type(Cypress.env("validTrustAdminPassword"));

  cy.get("button").contains("Log in").click();
};

function WhenIClickHospitalsOnTheNavigationBar() {
  cy.get("a.nhsuk-header__navigation-link").contains("Hospitals").click();
}

function ThenISeeTheHospitalsPage() {
  cy.get("h1").should("contain", "Hospitals");
}

function WhenIClickToReturnToThePageForTheHospital() {
  cy.get("a").contains("Return to Test Hospital").click();
}

function ThenISeeThePageForTheHospital() {
  cy.get("h1").should("contain", "Test Hospital");
}

module.exports = {
  GivenIAmLoggedInAsATrustAdmin,
  WhenIClickHospitalsOnTheNavigationBar,
  ThenISeeTheHospitalsPage,
  WhenIClickToReturnToThePageForTheHospital,
  ThenISeeThePageForTheHospital,
};
