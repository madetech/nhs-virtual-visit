import { 
  ThenISeeAnError,
  ThenISeeTheManageYourTrustLoginPage, 
} from "../commonSteps";

describe("As a trust manager or admin, I want to reset my password if I forget it", () => {
  let link;

  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset:mssql && npm run dbmigratetest up:mssql"
    );
  });

  it("given a invalid reset password link, shows an error", () => {
    GivenIVisitAnInvalidResetPasswordLink();
    ThenISeeAnError();
    cy.audit();
  });

  it("given a valid reset password link, visits a reset password page and resets password", () => {
    GivenIVisitAValidResetPasswordLink();
    ThenISeeTheEnterNewPasswordPage();
    cy.audit();

    WhenIFillOutTheResetPasswordFormWithTheSamePassword();
    AndISubmitTheForm();
    ThenISeeTheResetPasswordSuccessPage(
      Cypress.env("trustManagerEmailToResetPassword")
    );
    cy.audit();

    WhenIClickOnTheLoginLink();
    ThenISeeTheManageYourTrustLoginPage();
    WhenIEnterTheTrustManagerEmailAndNewPassword();
    AndISubmitTheLoginForm();
    ThenISeeTheTrustManagerHomePage();
    cy.audit()
  });

  it("given a valid reset password link, a user can only use the link once", () => {
    GivenIVisitAValidResetPasswordLinkTwice();
    ThenISeeAnError();
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

  function AndISubmitTheLoginForm() {
    cy.get("button").contains("Log in").click();
  }

  function ThenISeeTheResetPasswordSuccessPage() {
    cy.get('[data-cy="panel-success-header"]').should(
      "contain",
      `Password has been reset`
    );
  }

  function GivenIVisitAValidResetPasswordLink() {
    cy.request("POST", "/api/test-endpoints/test-send-reset-password-email")
      .then((res) => {
        link = res.body.link;
        cy.visit(link);
      });
  }

  function WhenIClickOnTheLoginLink() {
    cy.get("a.nhsuk-action-link__link").contains("Return to Login page").click();
  }
  

  function WhenIEnterTheTrustManagerEmailAndNewPassword() {
    cy.get("input[name=email]").type(Cypress.env("trustManagerEmailToResetPassword"));
    cy.get("input[name=password]").type("newPassword");
  }

  function ThenISeeTheTrustManagerHomePage() {
    cy.get('[data-cy=trust-name]').should("contain", "Airedale NHS Foundation Trust");
    cy.get('[data-cy=layout-title]').should("contain", "Dashboard");
  }

  function GivenIVisitAValidResetPasswordLinkTwice() {
    cy.visit(link);
  }
});
