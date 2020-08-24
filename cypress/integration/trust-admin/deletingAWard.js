describe("As a trust admin, I want to delete a ward so that it can no longer use the virtual visits service.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows a trust admin to delete a ward", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickOnAHospital();
    ThenISeeThePageForTheHospital();

    WhenIClickToDeleteAWard();
    ThenISeeTheDeleteAWardConfirmationPage();
    cy.audit();

    WhenIConfirmIWantToDeleteThisWard();
    ThenISeeTheWardIsDeleted();

    WhenIClickToReturnToThePageForTheHospital();
    ThenISeeThePageForTheHospital();
    AndIDoNotSeeTheDeletedWard();
  });

  // Allows a trust admin to delete a ward
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

  function WhenIClickToDeleteAWard() {
    cy.get("a").contains("Delete Test Ward One").click();
  }

  function ThenISeeTheDeleteAWardConfirmationPage() {
    cy.get("h1").should(
      "contain",
      "Are you sure you want to delete this ward?"
    );
  }

  function WhenIConfirmIWantToDeleteThisWard() {
    cy.get("button").contains("Yes, delete this ward").click();
  }

  function ThenISeeTheWardIsDeleted() {
    cy.get("h1").should("contain", "Test Ward One has been deleted");
  }

  function WhenIClickToReturnToThePageForTheHospital() {
    cy.get("a").contains("Return to Test Hospital").click();
  }

  function AndIDoNotSeeTheDeletedWard() {
    cy.get("td").should("not.contain", "Test Ward One");
  }
});
