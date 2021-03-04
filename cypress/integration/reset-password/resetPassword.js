describe("As a trust manager or admin, I want to reset my password if I forget it", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset:mssql && npm run dbmigratetest up:mssql"
    );
  });

  it("given a invalid reset password link, shows an error", () => {
    GivenIVisitAnInvalidResetPasswordLink();
    ThenISeeErrors();
    cy.audit();
  });

  it("given a valid reset password link, visits a reset password page and resets password", () => {
    GivenIVisitAValidResetPasswordLink();
    ThenISeeTheEnterNewPasswordPage();

    WhenIFillOutTheResetPasswordFormWithTheSamePassword();
    AndISubmitTheForm();
    ThenISeeTheResetPasswordSuccessPage(
      Cypress.env("trustManagerEmailToResetPassword")
    );
  });

  it("given a valid reset password link, a user can only use the link once", () => {
    GivenIVisitAValidResetPasswordLinkTwice();
    ThenISeeErrors();
    cy.audit();
  });

  function GivenIVisitAnInvalidResetPasswordLink() {
    cy.visit(
      Cypress.env("baseUrl") +
        "/reset-password/" +
        "huihiuhiusnefiubi.cisojsoide"
    );
  }

  function ThenISeeTheEnterNewPasswordPage() {
    cy.get("[data-cy=page-heading]").should(
      "contain",
      "Reset Password for " + Cypress.env("trustManagerEmailToResetPassword")
    );
  }

  function WhenIFillOutTheResetPasswordFormWithTheSamePassword() {
    cy.get("[data-cy=password-input]").clear().type("newPassword");
    cy.get("[data-cy=confirm-password-input]").clear().type("newPassword");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Reset Password").click();
  }

  function ThenISeeTheResetPasswordSuccessPage() {
    cy.get('[data-cy="panel-success-header"]').should(
      "contain",
      `Password has been reset`
    );
  }

  function ThenISeeErrors() {
    cy.get('[data-cy="error-summary"]').should("contain", "There is a problem");
  }

  function GivenIVisitAValidResetPasswordLink() {
    cy.request("POST", "/api/test-endpoints/test-send-reset-password-email", { email: Cypress.env("trustManagerEmailToResetPassword") })
      .then((res) => {
        const link = res.body.link;
        cy.log(res.status)
        cy.visit(link);
      });
  }

  function GivenIVisitAValidResetPasswordLinkTwice() {
    cy.request("POST", "/api/test-endpoints/test-send-reset-password-email", { email: Cypress.env("trustManagerEmailToResetPassword") })
      .then((res) => {
        const link = res.body.link;
        cy.visit(link);
        cy.visit(link);
      });
  }
});
