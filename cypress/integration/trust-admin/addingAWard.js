describe("As a trust admin, I want to add a ward so that ward staff can book virtual visits.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows a trust admin to add a ward", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickOnAHospital();
    ThenISeeThePageForTheHospital();

    WhenIClickOnAddAWard();
    ThenISeeTheAddAWardForm();

    cy.audit();

    WhenIFillOutTheForm();
    AndISubmitTheForm();
    ThenISeeTheWardIsAdded();

    WhenIClickToReturnToThePageForTheHospital();
    ThenISeeThePageForTheHospital();
    AndISeeTheAddedWard();
  });

  it("displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickOnAHospital();
    ThenISeeThePageForTheHospital();

    WhenIClickOnAddAWard();
    ThenISeeTheAddAWardForm();

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

  function WhenIClickOnAddAWard() {
    cy.get("button").contains("Add a ward").click();
  }

  function ThenISeeTheAddAWardForm() {
    cy.get("h1").should("contain", "Add a ward");
  }

  function WhenIFillOutTheForm() {
    cy.get("input[name=ward-name]").type("Glimmer Ward");
    cy.get("input[name=ward-code]").type("glimmercode");
    cy.get("input[name=ward-code-confirmation]").type("glimmercode");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Add ward").click();
  }

  function ThenISeeTheWardIsAdded() {
    cy.get("h1").should("contain", "Glimmer Ward has been added");
  }

  function WhenIClickToReturnToThePageForTheHospital() {
    cy.get("a").contains("Return to Test Hospital").click();
  }

  function AndISeeTheAddedWard() {
    cy.get("td").should("contain", "Glimmer Ward");
  }

  // Displays errors when fields have been left blank
  function WhenISubmitFormWithoutFillingAnythingOut() {
    cy.get("button").contains("Add ward").click();
  }

  function ThenISeeErrors() {
    cy.contains("There is a problem").should("be.visible");
  }
});
