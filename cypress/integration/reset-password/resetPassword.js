describe("As a trust manager or admin, I want to reset my password if I forget it", () => {
  it("given a invalid reset password link, shows an error", () => {
    GivenIVisitInvalidResetPasswordLink();
    ThenISeeErrors();
    cy.audit();
  });

  it("given a valid reset password link, visits a reset password page", () => {
    GivenIVisitAValidResetPasswordLink();
    ThenISeeTheEnterNewPasswordPage();

    WhenIFillOutTheResetPasswordFormWithTheSamePassword();
    AndISubmitTheForm();
    ThenISeeTheResetPasswordSuccessPage(
      Cypress.env("TrustAdminEmailToResetPassword")
    );
  });

  function GivenIVisitInvalidResetPasswordLink() {
    cy.visit(
      Cypress.env("baseUrl") +
        "/reset-password/" +
        "huihiuhiusnefiubi.cisojsoide"
    );
  }

  function ThenISeeTheEnterNewPasswordPage() {
    cy.get("[data-cy=page-heading]").should(
      "contain",
      "Reset Password for " + Cypress.env("TrustAdminEmailToResetPassword")
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
    expect(Cypress.env("jwtPrivateKey")).to.equal(
      "cypress/fixtures/hashedPassword.txt"
    );
    cy.task("generateToken", {
      privateKey: Cypress.env("jwtPrivateKey"),
      algo: "HS256",
      expires: "2h",
      claims: {
        emailAddress: Cypress.env("TrustAdminEmailToResetPassword"),
        version: Cypress.env("tokenVersion"),
      },
    }).then((result) => {
      const token = result;
      cy.visit(Cypress.env("baseUrl") + "/reset-password/" + token);
    });
  }
});
