describe("As a trust manager or admin, I want to reset my password if I forget it", () => {
  it("sends an email with reset password link, when I fill in a valid email", () => {
    GivenIAmOnTheLoginPage();
    WhenIClickTheResetPasswordLink();
    ThenISeeTheResetPasswordPage();
    cy.audit();

    WhenIFillOutTheResetPasswordFormOnTheResetPasswordPage(
      Cypress.env("validTrustManagerEmail")
    );
    AndISubmitTheForm();
    ThenISeeTheResetPasswordSuccessPage(Cypress.env("validTrustManagerEmail"));
  });
  it("gives an error to reset password, when I fill in an invalid email", () => {
    const invalidEmail = "invalid-email@nhs.co.uk";
    GivenIAmOnTheLoginPage();
    WhenIClickTheResetPasswordLink();
    ThenISeeTheResetPasswordPage();
    cy.audit();

    WhenIFillOutTheResetPasswordFormOnTheResetPasswordPage(invalidEmail);
    AndISubmitTheForm();
    ThenISeeErrors();
  });

  function GivenIAmOnTheLoginPage() {
    cy.visit(Cypress.env("baseUrl") + "/login");
  }
  function WhenIClickTheResetPasswordLink() {
    cy.get("[data-cy=reset-password-link]").contains("Reset Password").click();
  }
  function ThenISeeTheResetPasswordPage() {
    cy.get("[data-cy=page-heading]").should("contain", "Reset Password");
  }
  function WhenIFillOutTheResetPasswordFormOnTheResetPasswordPage(email) {
    cy.get("[data-cy=email-input]").clear().type(email);
  }
  function AndISubmitTheForm() {
    cy.get("button").contains("Reset Password").click();
  }
  function ThenISeeTheResetPasswordSuccessPage(email) {
    cy.get('[data-cy="panel-success-header"]').should(
      "contain",
      `Email has been sent to ${email}`
    );
  }
  function ThenISeeErrors() {
    cy.get('[data-cy="error-summary"]').should("contain", "There is a problem");
  }
});
