describe("As an admin, I want to edit a trust so that I can update the details of a trust.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows an admin to edit a trust", () => {
    GivenIAmLoggedInAsAnAdmin();
    WhenIClickToEditATrust();
    ThenISeeTheEditATrustForm();

    WhenIUpdateTheVideoProvider();
    AndISubmitTheForm();
    ThenISeeTheTrustIsUpdated();

    WhenIClickToReturnToSiteAdministration();
    ThenISeeTheSiteAdministrationPage();
    AndISeeTheUpdatedTrust();
  });

  // Allows an admin to edit a trust
  function GivenIAmLoggedInAsAnAdmin() {
    cy.visit(Cypress.env("baseUrl") + "/admin/login");
    cy.get("input[name=code]").type(Cypress.env("validAdminCode"));
    cy.get("input[name=password]").type(Cypress.env("validAdminPassword"));
    cy.get("button").contains("Log in").click();
  }

  function WhenIClickToEditATrust() {
    cy.get("a.nhsuk-link").contains("Edit Test Trust").click();
  }

  function ThenISeeTheEditATrustForm() {
    cy.get("h1").should("contain", "Edit Test Trust");
  }

  function WhenIUpdateTheVideoProvider() {
    cy.get("select[name=video-provider]").select("whereby");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Edit Trust").click();
  }

  function ThenISeeTheTrustIsUpdated() {
    cy.get("h1").should("contain", "Test Trust has been updated");
  }

  function WhenIClickToReturnToSiteAdministration() {
    cy.get("a").contains("Return to site administration").click();
  }

  function ThenISeeTheSiteAdministrationPage() {
    cy.get("h1").should("contain", "Site administration");
  }

  function AndISeeTheUpdatedTrust() {
    cy.get("[data-testid=test-trust]").should("contain", "Whereby");
  }
});
