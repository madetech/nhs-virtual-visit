describe("Scheduling a call", () => {
  beforeEach(() => {
    cy.visit(Cypress.env("baseUrl"));
    cy.get("input").type(Cypress.env("validWard"));
    cy.get("button").contains("Log in").click();
  });
  it("Given a user has logged in, when they click schedule vist, they should see the input forms", () => {
    cy.get("[data-qa='ward-visits']");
    cy.get("a").contains("Schedule visit").click();
    cy.get("[data-qa='schedule-visit']");
    cy.get("input[name=patient-name]").should("be.visible");
    cy.get("input[name=contact]").should("be.visible");
    cy.get("input[name=day]").should("be.visible");
    cy.get("input[name=month]").should("be.visible");
    cy.get("input[name=year]").should("be.visible");
    cy.get("input[name=hour]").should("be.visible");
    cy.get("input[name=minute]").should("be.visible");
  });
  it("Given a user knows the correct information, when they fill out the form, they should see a check answers page", () => {
    cy.get("span").contains("Schedule visit").click();
    cy.get("input[name=patient-name]").type(Cypress.env("patientName"));
    cy.get("input[name=contact]").type(Cypress.env("contactNumber"));
    cy.get("button").contains("Continue").click();
    cy.get("dl").find("div").should("have.length", 4);
    cy.get("h1")
      .contains("Check your answers before scheduling a visit")
      .should("be.visible");
    cy.get("dd").contains(Cypress.env("patientName"));
    cy.get("dd").contains(Cypress.env("contactNumber"));
  });
  it("Given a user confirms all the information on the check answers page, when they click continue, they should be redirected", () => {
    cy.get("[data-qa='ward-visits']");
    cy.get("a").contains("Schedule visit").click();
    cy.get("[data-qa='schedule-visit']");
    cy.get("input[name=patient-name]").type(Cypress.env("patientName"));
    cy.get("input[name=contact]").type(Cypress.env("contactNumber"));
    cy.get("button").contains("Continue").click();
    cy.get("button").contains("Schedule visit").click();
    cy.get("[data-qa='schedule-success']");
    cy.get("a").contains("Schedule another visit").should("be.visible");
    cy.get("a").contains("View visits").should("be.visible");
  });
});
