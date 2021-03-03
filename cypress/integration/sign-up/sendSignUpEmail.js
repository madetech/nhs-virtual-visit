import { 
  WhenIVisitTheLandingPage,
  ThenIVisitTheManageYourTrustLoginPage,
  ThenISeeAnError,
} from "../commonSteps";

describe("As an nhs employee, I can sign up to a trust", () => {
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
    AndISubmitTheForm();
    ThenISeeTheSignUpSuccessPage(Cypress.env("signUpManagerEmail"));
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
    AndISubmitTheForm();
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
    AndISubmitTheForm();
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
    AndISubmitTheForm();
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
    AndISubmitTheForm();
    ThenISeeAnError();
  });

  function WhenIClickTheManagerSignUpLink() {
    cy.get("[data-cy=sign-up-link]").contains("Manager Sign Up").click();
  }

  function ThenISeeTheSignUpPage() {
    cy.get("[data-cy=page-heading]").should("contain", "Sign up to access your site");
  }

  function WhenIFillOutTheSignUpForm(organisation, email, password, confirmPassword) {
    organisation && cy.get("[data-cy=organisation-input").select(organisation);
    email && cy.get("[data-cy=email-input").clear().type(email);
    password && cy.get("[data-cy=password-input]").clear().type(password);
    confirmPassword && cy.get("[data-cy=confirm-password-input]").clear().type(confirmPassword);
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Sign Up").click()
  }

  function ThenISeeTheSignUpSuccessPage(email) {
    cy.get("[data-cy=panel-success-header]").should(
      "contain",
      `Email has been sent to ${email}`
    );
  }
});