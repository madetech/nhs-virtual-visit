Cypress.Commands.add("audit", () => {
  if (Cypress.env("runAudit")) {
    cy.lighthouse({
      performance: Cypress.env("performance") ? 90 : 0,
    });
  }
});
