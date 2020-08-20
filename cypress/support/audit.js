Cypress.Commands.add("audit", () => {
  if (Cypress.env("runAudit")) {
    cy.lighthouse();
  }
});
