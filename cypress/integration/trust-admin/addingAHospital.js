describe("As a trust admin, I want to add a hospital so that I can manage virtual visits per hospital.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows a trust admin to add a hospital", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickAddAHospital();
    ThenISeeTheAddAHospitalForm();

    WhenIFillOutTheForm();
    AndISubmitTheForm();
    ThenISeeTheHospitalIsAdded();

    WhenIClickToGoToTheAddedHospital();
    ThenISeeTheAddedHospitalPage();
  });

  it("displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickAddAHospital();
    ThenISeeTheAddAHospitalForm();

    WhenISubmitFormWithoutFillingAnythingOut();
    ThenISeeErrors();
  });

  // Allows a trust admin to add a hospital
  function GivenIAmLoggedInAsATrustAdmin() {
    cy.visit(Cypress.env("baseUrl"));
    cy.get("input").type(Cypress.env("validTrustAdminCode"));
    cy.get("button").contains("Log in").click();
  }

  function WhenIClickHospitalsOnTheNavigationBar() {
    cy.get("a.nhsuk-header__navigation-link").contains("Hospitals").click();
  }

  function ThenISeeTheHospitalsPage() {
    cy.get("h1").should("contain", "Hospitals");
  }

  function WhenIClickAddAHospital() {
    cy.get("a").contains("Add a hospital").click();
  }

  function ThenISeeTheAddAHospitalForm() {
    cy.get("h1").should("contain", "Add a hospital");
  }

  function WhenIFillOutTheForm() {
    cy.get("input[name=hospital-name]").type("Scorpia Hospital");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Add hospital").click();
  }

  function ThenISeeTheHospitalIsAdded() {
    cy.get("h1").should("contain", "Scorpia Hospital has been added");
  }

  function WhenIClickToGoToTheAddedHospital() {
    cy.get("a").contains("Go to Scorpia Hospital").click();
  }

  function ThenISeeTheAddedHospitalPage() {
    cy.get("h1").should("contain", "Scorpia Hospital");
  }

  // Displays errors when fields have been left blank
  function WhenISubmitFormWithoutFillingAnythingOut() {
    cy.get("button").contains("Add hospital").click();
  }

  function ThenISeeErrors() {
    cy.contains("There is a problem").should("be.visible");
  }
});
