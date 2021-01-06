function WhenIClickToReturnToSiteAdministration() {
  cy.get("a").contains("Return to site administration").click();
}

function ThenISeeTheSiteAdministrationPage() {
  cy.get("h1").should("contain", "Site administration");
}

const GivenIAmLoggedInAsAnAdmin = () => {
  cy.visit(Cypress.env("baseUrl") + "/login");
  cy.get("input[name=email]").type(Cypress.env("validAdminEmail"));
  cy.get("input[name=password]").type(Cypress.env("validAdminPassword"));
  cy.get("button").contains("Log in").click();
};

module.exports = {
  WhenIClickToReturnToSiteAdministration,
  ThenISeeTheSiteAdministrationPage,
  GivenIAmLoggedInAsAnAdmin,
};
