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
  it("receives an email with a link to visit to fill in new password",()=>{
    WhenICheckMyEmail();
    AndIVisitTheResetPasswordLinkInMyEmail();
    ThenISeeTheResetPasswordForm();
    WhenIFillInTheResetPasswordForm();
    AndISubmitTheForm();
    ThenISeeIHaveSuccessfullyResetMyPasswordPage(
      Cypress.env("trustManagerEmailToResetPassword")
    );

  })
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
  function WhenICheckMyEmail() {}
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
  function AndIVisitTheResetPasswordLinkInMyEmail() {
    cy.mhGetMailsBySubject('Virtual Visit Reset Password Link').mhFirst().mhGetBody().then(mail=>{
      cy.log(mail);
      abc = mail.replace(/\=|\s/g, '');
      cy.visit(abc, { timeout: 10000 });
    });
  }
  function WhenIFillInTheResetPasswordForm() {
    cy.get('[data-cy=password-input]').type("newPassword");
    cy.get('[data-cy=confirm-password-input]').type("newPassword");
  }
  function AndISubmitTheForm() {
    cy.get("button").contains("Reset Password").click();
  }
  function ThenISeeIHaveSuccessfullyResetMyPasswordPage() {
    cy.get('[data-cy="panel-success-header"]').should(
      "contain",
      `Password has been reset`
    );
  }
  function ThenISeeTheResetPasswordForm() {
    cy.get('[data-cy="page-heading"]').should("contain","Reset Password");
  }
  function ThenISeeErrors() {
    cy.get('[data-cy="error-summary"]').should("contain", "There is a problem");
  }
});
