const GivenIAmLoggedInAsATrustAdmin = () => {
  cy.visit(Cypress.env("baseUrl") + "/login");

  cy.get("input[name=email]").type(Cypress.env("validTrustManagerEmail"));
  cy.get("input[name=password]").type(Cypress.env("validTrustManagerPassword"));

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
  cy.get("input[name=ward-pin]").type("1234");
  cy.get("input[name=ward-pin-confirmation]").type("1234");
}

function AndISubmitTheAddWardForm() {
  cy.get("button").contains("Add ward").click();
}

function ThenISeeTheAddAWardForm() {
  cy.get("[data-cy=form-heading]").should("contain", "Add a ward");
}

function WhenIClickToEditAWard(name) {
  cy.get("a").contains(`Edit ${name}`).click();
}

function ThenISeeTheEditAWardForm() {
  cy.get("[data-cy=form-heading]").should("contain", "Edit a ward");
}

function AndISubmitTheEditWardForm() {
  cy.get("button").contains("Edit ward").click();
}

function WhenIClickToDeleteAWard(name) {
  let element = name.toLowerCase().replace(/\W+/g, "-");
  cy.get(`[data-testid=delete-${element}]`).click();
}

function ThenISeeTheWardIsDeleted(name) {
  cy.get("[data-cy=panel-success-header]").should("contain", `${name} has been deleted`);
}

function WhenIClickOnTrustManagersOnTheNavigationBar() {
  cy.get("a.nhsuk-header__navigation-link").contains("Managers").click();
}

function ThenISeeTheTrustManagersList() {
  cy.get("caption").should("contain", "List of Managers");
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
  WhenIClickOnTrustManagersOnTheNavigationBar,
  ThenISeeTheTrustManagersList,
};
