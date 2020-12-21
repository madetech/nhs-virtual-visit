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
  cy.get("h1", { timeout: 7000 }).should("contain", "Test Hospital");
}

function WhenIClickOnAHospital() {
  cy.get("a").contains("View Test Hospital").click();
}

function WhenIClickOnAddAWard() {
  cy.get("button").contains("Add a ward").click();
}

function WhenIFillOutTheAddWardForm(name) {
  cy.get("input[name=ward-name]").type(name);
  cy.get("input[name=ward-code]").type("glimmercode");
  cy.get("input[name=ward-code-confirmation]").type("glimmercode");
  cy.get("#ward-pin").type("1234");
  cy.get("#ward-pin-confirmation").type("1234");
}

function AndISubmitTheAddWardForm() {
  cy.get("button").contains("Add ward").click();
}

function ThenISeeTheAddAWardForm() {
  cy.get("h2").should("contain", "Add a ward");
}

function WhenIClickToEditAWard(name) {
  cy.get("a").contains(`Edit ${name}`).click();
}

function ThenISeeTheEditAWardForm() {
  cy.get("h2").should("contain", "Edit a ward");
}

function AndISubmitTheEditWardForm() {
  cy.get("button").contains("Edit ward").click();
}

function WhenIClickToDeleteAWard(name) {
  let element = name.toLowerCase().replace(/\W+/g, "-");
  cy.get(`[data-testid=delete-${element}]`).click();
}

function ThenISeeTheWardIsDeleted(name) {
  cy.get("h1").should("contain", `${name} has been deleted`);
}

module.exports = {
  GivenIAmLoggedInAsATrustAdmin,
  WhenIClickHospitalsOnTheNavigationBar,
  ThenISeeTheHospitalsPage,
  WhenIClickToReturnToThePageForTheHospital,
  ThenISeeThePageForTheHospital,
  WhenIClickOnAHospital,
  WhenIClickOnAddAWard,
  WhenIFillOutTheAddWardForm,
  AndISubmitTheAddWardForm,
  ThenISeeTheAddAWardForm,
  WhenIClickToEditAWard,
  ThenISeeTheEditAWardForm,
  AndISubmitTheEditWardForm,
  WhenIClickToDeleteAWard,
  ThenISeeTheWardIsDeleted,
};
