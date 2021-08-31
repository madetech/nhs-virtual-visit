import { 
  ThenISeeAnError,
  ThenISeeTheManageYourTrustLoginPage,
} from "../commonSteps";

describe("As an nhs manager, once I've signed up I can activate my account", () => {
  let link;
  
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset:mssql && npm run dbmigratetest up:mssql"
    );
  });

  it("given an invalid activation link, shows an error", () => {
    GivenIVisitAnInvalidActivationLink();
    ThenISeeAnError();
    cy.audit()
  });

  it("given a valid activation link, activates account, and allows user to login", () => {
    GivenIVisitAValidActivationLink();
    ThenISeeTheActivationSuccessPage();
    cy.audit();

    WhenIClickOnTheLoginLink();
    ThenISeeTheManageYourTrustLoginPage();
    cy.audit();

    WhenIEnterTheActivatedTrustManagerEmailAndPassword();
    AndISubmitTheForm();
    ThenISeeTheTrustManagerHomePageForActivatedTrust();
    cy.audit();
  });

  it("given a valid activation link, a user can only use the link once", () => {
    GivenIVisitAValidActivationLinkASecondTime();
    ThenISeeAnError();
    cy.audit();
  });

  function GivenIVisitAnInvalidActivationLink() {
    cy.visit(
      Cypress.env("baseUrl") + "/activate-account/" + "huihiuhiusnefiubi.cisojsoide"
    );
  }

  function GivenIVisitAValidActivationLink() {
    cy.request("POST", "/api/test-endpoints/test-send-sign-up-email", { type: "activation" })
      .then(res => {
        link = res.body.link;
        cy.visit(link);
      });
  }

  function GivenIVisitAValidActivationLinkASecondTime() {
    cy.visit(link);
  }

  function ThenISeeTheActivationSuccessPage() {
    cy.get("[data-cy=page-heading]").should("contain", "Account Activation Success");
  }

  function WhenIClickOnTheLoginLink() {
    cy.get("a.nhsuk-action-link__link").contains("Go to Login page").click();
  }

  function WhenIEnterTheActivatedTrustManagerEmailAndPassword() {
    cy.get("input[name=email]").type(Cypress.env("signUpManagerEmail"));
    cy.get("input[name=password]").type(
      Cypress.env("signUpPassword")
    );
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Log in").click();
  }

  function ThenISeeTheTrustManagerHomePageForActivatedTrust() {
    cy.get('[data-cy=trust-name]').should("contain", Cypress.env("signUpNewOrganisation"));
    cy.get('[data-cy=layout-title]').should("contain", "Dashboard");
  }
})