describe("Joining a call", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
    cy.get("input").type(Cypress.env("validWard"));
    cy.get("button").contains("Log in").click();
    cy.get("[data-qa='ward-visits']");
    cy.get("a").contains("Schedule visit").click();
    cy.get("input[name=patient-name]").type(Cypress.env("patientName"));
    cy.get("input[name=contact]").type(Cypress.env("contactNumber"));
    cy.get("button").contains("Continue").click();
    cy.get("button").contains("Schedule visit").click();
    cy.visit(Cypress.env("baseUrl"));
  });
  // TODO: Insert DB commands to remove data between each test
  // Hence why we are getting the last element in the list (really it should be the only one)
  it("Given a valid call, when a user click join call, they should be redirected to the video stream", () => {
    cy.get("tr")
      .last()
      .within((row) => {
        cy.get("button").contains("Start call").click();
      });
  });
});
