import { 
  WhenIVisitTheLandingPage,
  ThenIVisitTheManageYourTrustLoginPage,
  ThenISeeAnError,
} from "../commonSteps";

describe("As an nhs manager, I can sign up to a trust", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset:mssql && npm run dbmigratetest up:mssql"
    );
  });

  it("sends an email with an activation link, when form is filled out and submitted", () => {
    WhenIVisitTheLandingPage();
    ThenIVisitTheManageYourTrustLoginPage();
    WhenIClickTheManagerSignUpLink();
    ThenISeeTheSignUpPage();
    WhenIFillOutTheSignUpForm(
      Cypress.env("signUpNewOrganisation"), 
      Cypress.env("signUpManagerEmail"),
      Cypress.env("signUpPassword"),
      Cypress.env("signUpPassword")
    );
    AndISubmitTheSignUpForm();
    ThenISeeTheSignUpSuccessPage(Cypress.env("signUpManagerEmail"));
  });

  it("sends an email to existing trust manager, when form is filled out and submitted for a trust that is already active", () => {
    WhenIVisitTheLandingPage();
    ThenIVisitTheManageYourTrustLoginPage();
    WhenIClickTheManagerSignUpLink();
    ThenISeeTheSignUpPage();
    WhenIFillOutTheSignUpForm(
      Cypress.env("signUpExistingOrganisation"), 
      "nhs-person2@nhs.co.uk",
      Cypress.env("signUpPassword"),
      Cypress.env("signUpPassword")
    );
    AndISubmitTheSendRequestForm();
    ThenISeeTheSendRequestSuccessPage();
  });

  it("gives an error when there isn't an organisation selected", () => {
    WhenIVisitTheLandingPage();
    ThenIVisitTheManageYourTrustLoginPage();
    WhenIClickTheManagerSignUpLink();
    ThenISeeTheSignUpPage();
    WhenIFillOutTheSignUpForm(
      null, 
      Cypress.env("signUpManagerEmail"),
      Cypress.env("signUpPassword"),
      Cypress.env("signUpPassword")
    );
    AndISubmitTheSignUpForm();
    ThenISeeAnError();
  });

  xit("gives an error when signing up with an invalid email", () => {
    const invalidEmail = "test@invalid.com";
    WhenIVisitTheLandingPage();
    ThenIVisitTheManageYourTrustLoginPage();
    WhenIClickTheManagerSignUpLink();
    ThenISeeTheSignUpPage();
    WhenIFillOutTheSignUpForm(
      Cypress.env("signUpNewOrganisation"), 
      invalidEmail,
      Cypress.env("signUpPassword"),
      Cypress.env("signUpPassword")
    );
    AndISubmitTheSignUpForm();
    ThenISeeAnError();
  });

  it("gives an error when password and confirm password don't match", () => {
    const invalidConfirmPassword = "InvalidPassword"
    WhenIVisitTheLandingPage();
    ThenIVisitTheManageYourTrustLoginPage();
    WhenIClickTheManagerSignUpLink();
    ThenISeeTheSignUpPage();
    WhenIFillOutTheSignUpForm(
      Cypress.env("signUpNewOrganisation"), 
      Cypress.env("signUpManagerEmail"),
      Cypress.env("signUpPassword"),
      invalidConfirmPassword
    );
    AndISubmitTheSignUpForm();
    ThenISeeAnError();
  });

  it("gives an error if the password doesn't conform to the password rules", () => {
    const shortPassword = "abcd"
    WhenIVisitTheLandingPage();
    ThenIVisitTheManageYourTrustLoginPage();
    WhenIClickTheManagerSignUpLink();
    ThenISeeTheSignUpPage();
    WhenIFillOutTheSignUpForm(
      Cypress.env("signUpNewOrganisation"), 
      Cypress.env("signUpManagerEmail"),
      shortPassword,
      shortPassword
    );
    AndISubmitTheSignUpForm();
    ThenISeeAnError();
  });

  function WhenIClickTheManagerSignUpLink() {
    cy.get("[data-cy=sign-up-link]").contains("Manager Sign Up").click();
  }

  function ThenISeeTheSignUpPage() {
    cy.get("[data-cy=page-heading]").should("contain", "Sign up to access your site");
  }

  function WhenIFillOutTheSignUpForm(organisation, email, password, confirmPassword) {
    organisation && cy.get("[data-cy=organisation-input]").type(organisation);
    email && cy.get("[data-cy=email-input]").clear().type(email);
    password && cy.get("[data-cy=password-input]").clear().type(password);
    confirmPassword && cy.get("[data-cy=confirm-password-input]").clear().type(confirmPassword);
  }

  function AndISubmitTheSignUpForm() {
    cy.get("button").contains("Sign Up").click()
  }
  
  function AndISubmitTheSendRequestForm() {
    cy.get("button").contains("Send Request").click()
  }

  function ThenISeeTheSignUpSuccessPage(email) {
    cy.get("[data-cy=panel-success-header]").should(
      "contain",
      `Email has been sent to ${email}`
    );
  }

  function ThenISeeTheSendRequestSuccessPage() {
    cy.get("[data-cy=panel-success-header]").should(
      "contain",
      "Email has been sent to a trust manager to authorise access"
    );
  }
});