describe("Logging in", () => {
  it("Given a valid ward code, when a user enters this information, the user should be able to sign in", () => {
    cy.visit(Cypress.env("baseUrl"));
    cy.get("input").type(Cypress.env("validWard"));
    cy.get("button").contains("Log in").click();
    cy.contains("The code you entered was not recognised").should(
      "not.be.visible"
    );
    cy.log("Waiting...");
    cy.wait(10000);
    cy.get("[data-qa='ward-visits']");
  });

  it("Given an invalid code, when a user enters this informtion, the user should see an error", () => {
    cy.visit(Cypress.env("baseUrl"));
    cy.get("input").type(Cypress.env("fakeWard"));
    cy.get("button").contains("Log in").click();
    cy.contains("There is a problem").should("be.visible");
    cy.contains("The code you entered was not recognised").should("be.visible");
  });
});
