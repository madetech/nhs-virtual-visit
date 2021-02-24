describe("As a trust manager or admin, I want to reset my password if I forget it", () => {
  it("given a invalid reset password link, shows an error", () => {
    GivenIVisitInvalidResetPasswordLink();
    ThenISeeErrors();
    cy.audit();
  });

  xit("given a valid reset password link, visits a reset password page", () => {
    GivenIAmOnTheLoginPage();
    WhenIClickTheResetPasswordLink();
    ThenISeeTheResetPasswordPage();
    cy.audit()

    WhenIFillOutTheResetPasswordFormOnTheResetPasswordPage(
      Cypress.env("validTrustManagerEmail")
    );
    AndISubmitTheForm2();
    ThenISeeTheResetPasswordSuccessPage2(Cypress.env("validTrustManagerEmail"));
    
    // ************************

    GivenIVisitAValidResetPasswordLink();
    ThenISeeTheEnterNewPasswordPage();

    WhenIFillOutTheResetPasswordFormWithTheSamePassword();
    AndISubmitTheForm();
    ThenISeeTheResetPasswordSuccessPage(
      Cypress.env("trustManagerEmailToResetPassword")
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
    cy.task("generateToken", {
      algo: "HS256",
      expires: "2h",
      claims: {
        emailAddress: Cypress.env("trustManagerEmailToResetPassword"),
        version: Cypress.env("tokenVersion"),
      },
    }).then((result) => {
      const token = result;
      cy.visit(Cypress.env("baseUrl") + "/reset-password/" + token);
    });
  }

  // Common functions with sendResetPasswordEmail.js

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
  function ThenISeeTheResetPasswordSuccessPage2(email) {
    cy.get('[data-cy="panel-success-header"]').should(
      "contain",
      `Email has been sent to ${email}`
    );
  }
  function AndISubmitTheForm2() {
    cy.get("button").contains("Reset Password").click()
  }
});
