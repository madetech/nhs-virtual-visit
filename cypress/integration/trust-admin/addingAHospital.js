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

    cy.audit();

    WhenIClickAddAHospital();
    ThenISeeTheAddAHospitalForm();

    cy.audit();

    WhenIFillOutTheForm();
    AndISubmitTheForm();
    ThenISeeTheHospitalIsAdded();
    WhenIClickToGoToTheAddedHospital();
    ThenISeeTheAddedHospitalPage();

    cy.audit();
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

  it("displays errors when survey url is invalid", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickAddAHospital();
    ThenISeeTheAddAHospitalForm();

    WhenIFillOutTheFormWithBadSurveyUrl();
    AndISubmitTheForm();
    ThenISeeErrors();
  });

  it("displays errors when support url is invalid", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickAddAHospital();
    ThenISeeTheAddAHospitalForm();

    WhenIFillOutTheFormWithBadSupportUrl();
    AndISubmitTheForm();
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

  function WhenIClickAddAHospital() {
    cy.get("a").contains("Add a hospital").click();
  }

  function ThenISeeTheAddAHospitalForm() {
    cy.get("h1").should("contain", "Add a hospital");
  }

  function WhenIFillOutTheForm() {
    cy.get("input[name=hospital-name]").type("Scorpia Hospital");
    cy.get("input[name=hospital-survey-url]").type(
      "https://www.survey.example.com"
    );
    cy.get("input[name=hospital-support-url]").type(
      "https://www.support.example.com"
    );
  }

  function WhenIFillOutTheFormWithBadSurveyUrl() {
    cy.get("input[name=hospital-name]").type("Scorpia Hospital");
    cy.get("input[name=hospital-survey-url]").type("https://www");
  }

  function WhenIFillOutTheFormWithBadSupportUrl() {
    cy.get("input[name=hospital-name]").type("Scorpia Hospital");
    cy.get("input[name=hospital-support-url]").type("https://www");
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
