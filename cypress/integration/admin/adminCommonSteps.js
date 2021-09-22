function WhenIClickToReturnToSiteAdministration() {
  cy.get("a").contains("Return to site administration").click();
}

function ThenISeeTheSiteAdministrationPage() {
  cy.get("h1").should("contain", "Site administration");
}

module.exports = {
  WhenIClickToReturnToSiteAdministration,
  ThenISeeTheSiteAdministrationPage
};
