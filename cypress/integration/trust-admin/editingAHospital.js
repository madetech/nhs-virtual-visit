describe("As an admin, I want to edit a hospital so that I can keep hospital changes up to date.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  function GivenIAmLoggedInAsAnAdmin() {
    cy.visit(Cypress.env("baseUrl") + "/trust-admin/login");
    cy.get("input[name=code]").type(Cypress.env("validTrustAdminCode"));
    cy.get("input[name=password]").type(Cypress.env("validTrustAdminPassword"));
    cy.get("button").contains("Log in").click();
  }

  function WhenIClickOnHospitals() {
    cy.get("a.nhsuk-header__navigation-link").contains("Hospitals").click();
  }

  function ThenISeeTheHospitalList() {
    cy.get("caption").should("contain", "List of hospitals");
  }

  function WhenIClickOnTheEditLink() {
    cy.get("a.nhsuk-link").contains("Edit").click();
  }

  function ThenIShouldBeOnTheEditHospitalPage() {
    cy.url().should("include", "/trust-admin/hospitals/1/edit");
    cy.get("input[name=hospital-name]").should("have.value", "Test Hospital");
  }

  function WhenIFillOutTheForm() {
    cy.get("input[name=hospital-name]").type(" updated");
    cy.get("input[name=hospital-survey-url]").type(
      "https://www.survey.example.com"
    );
  }

  function AndIClickTheEditHospitalButton() {
    cy.get("button[type=submit]").contains("Edit hospital").click();
  }

  function ThenIShouldBeOnTheEditSuccessPageWithNewName() {
    cy.url().should("include", "/trust-admin/hospitals/1/edit-success");
    cy.get("h1.nhsuk-panel__title").should(
      "contain",
      "Test Hospital updated has been updated"
    );
  }

  function WhenISubmitFormEmptyHospitalName() {
    cy.get("input[name=hospital-name]").clear();
    AndIClickTheEditHospitalButton();
  }

  function ThenISeeErrors() {
    cy.get(".nhsuk-error-summary").should("be.visible");
  }

  it("displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsAnAdmin();
    WhenIClickOnHospitals();
    ThenISeeTheHospitalList();

    WhenIClickOnTheEditLink();
    ThenIShouldBeOnTheEditHospitalPage();

    WhenISubmitFormEmptyHospitalName();
    ThenISeeErrors();
  });

  it("allows an admin to edit a hospital", () => {
    GivenIAmLoggedInAsAnAdmin();
    WhenIClickOnHospitals();
    ThenISeeTheHospitalList();

    WhenIClickOnTheEditLink();
    ThenIShouldBeOnTheEditHospitalPage();

    WhenIFillOutTheForm();
    AndIClickTheEditHospitalButton();
    ThenIShouldBeOnTheEditSuccessPageWithNewName();
  });
});
