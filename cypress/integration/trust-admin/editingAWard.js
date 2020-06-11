describe("As a trust admin, I want to edit a ward so that I can modify the details of a ward.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows a trust admin to edit a ward", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickOnAHospital();
    ThenISeeThePageForTheHospital();

    WhenIClickToEditAWard();
    ThenISeeTheEditAWardForm();

    WhenIFillOutTheForm();
    AndISubmitTheForm();
    ThenISeeTheWardIsUpdated();

    WhenIClickToReturnToThePageForTheHospital();
    ThenISeeThePageForTheHospital();
    AndISeeTheEditedWard();
  });

  it("displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickOnAHospital();
    ThenISeeThePageForTheHospital();

    WhenIClickToEditADifferentWard();
    ThenISeeTheEditAWardForm();

    WhenISubmitFormWithoutFillingAnythingOut();
    ThenISeeErrors();
  });

  // Allows a trust admin to add a hospital
  function GivenIAmLoggedInAsATrustAdmin() {
    cy.visit(Cypress.env("baseUrl") + "/trust-admin/login");

    cy.get("input[name=code]").type(Cypress.env("validTrustAdminCode"));
    cy.get("input[name=password]").type(Cypress.env("validTrustAdminPassword"));

    cy.get("button").contains("Log in").click();
  }

  function WhenIClickHospitalsOnTheNavigationBar() {
    cy.get("a.nhsuk-header__navigation-link").contains("Hospitals").click();
  }

  function ThenISeeTheHospitalsPage() {
    cy.get("h1").should("contain", "Hospitals");
  }

  function WhenIClickOnAHospital() {
    cy.get("a").contains("View Test Hospital").click();
  }

  function ThenISeeThePageForTheHospital() {
    cy.get("h1").should("contain", "Test Hospital");
  }

  function WhenIClickToEditAWard() {
    cy.get("a").contains("Edit Test Ward One").click();
  }

  function ThenISeeTheEditAWardForm() {
    cy.get("h1").should("contain", "Edit a ward");
  }

  function WhenIFillOutTheForm() {
    cy.get("input[name=ward-name]").clear();
    cy.get("input[name=ward-name]").type("Different Name Ward");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Edit ward").click();
  }

  function ThenISeeTheWardIsUpdated() {
    cy.get("h1").should("contain", "Different Name Ward has been updated");
  }

  function WhenIClickToReturnToThePageForTheHospital() {
    cy.get("a").contains("Return to Test Hospital").click();
  }

  function AndISeeTheEditedWard() {
    cy.get("td").should("contain", "Different Name Ward");
  }

  // Displays errors when fields have been left blank
  function WhenIClickToEditADifferentWard() {
    cy.get("a").contains("Edit Test Ward Two").click();
  }

  function WhenISubmitFormWithoutFillingAnythingOut() {
    cy.get("input[name=ward-name]").clear();
    cy.get("button").contains("Edit ward").click();
  }

  function ThenISeeErrors() {
    cy.contains("There is a problem").should("be.visible");
  }
});
