function WhenIClickToReturnToSiteAdministration() {
  cy.get("a").contains("Return to site administration").click();
}

function ThenISeeTheSiteAdministrationPage() {
  cy.get("h1").should("contain", "Site administration");
}

const GivenIAmLoggedInAsAnAdmin = () => {
  cy.visit(Cypress.env("baseUrl") + "/admin/login");
  cy.get("input[name=code]").type(Cypress.env("validAdminCode"));
  cy.get("input[name=password]").type(Cypress.env("validAdminPassword"));
  cy.get("button").contains("Log in").click();
};

module.exports = {
  WhenIClickToReturnToSiteAdministration,
  ThenISeeTheSiteAdministrationPage,
  GivenIAmLoggedInAsAnAdmin,
};
