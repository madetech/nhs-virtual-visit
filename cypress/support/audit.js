Cypress.Commands.add("audit", () => {
  if (Cypress.env("runAudit")) {
    cy.log("running lighthouse!");
    cy.lighthouse({
      performance: Cypress.env("performance") ? 90 : 0,
    });
  } else {
    cy.log("lighthouse disabled");
  }
});
