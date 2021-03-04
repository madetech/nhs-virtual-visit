import { 
  ThenISeeAnError,
  ThenISeeTheManageYourTrustLoginPage,
} from "../commonSteps";

describe("As an nhs manager, once I've signed up I can activate my account", () => {
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

    WhenIClickOnTheLoginLink();
    ThenISeeTheManageYourTrustLoginPage();

    WhenIEnterTheActivatedTrustManagerEmailAndPassword();
    AndISubmitTheForm();
    ThenISeeTheTrustManagerHomePageForActivatedTrust();
  });

  it("given a valid activation link, a user can only use the link once", () => {
    GivenIVisitAValidActivationLinkTwice();
    ThenISeeAnError();
    cy.audit();
  })

  function GivenIVisitAnInvalidActivationLink() {
    cy.visit(
      Cypress.env("baseUrl") + "/activate-account/" + "huihiuhiusnefiubi.cisojsoide"
    );
  }

  function GivenIVisitAValidActivationLink() {
    const organisation = {
      id: Cypress.env("signUpNewOrganisationId"),
      name: Cypress.env("signUpNewOrganisation"),
    }
    cy.request("POST", "/api/test-endpoints/test-send-sign-up-email", {
      organisation,
      email: Cypress.env("signUpManagerEmail"),
      password: Cypress.env("signUpPassword"),
      confirmPassword: Cypress.env("signUpPassword")
    }).then(res => {
      const link = res.body.link;
      cy.visit(link);
    })
  }

  function GivenIVisitAValidActivationLinkTwice() {
    const organisation = {
      id: 3,
      name: "Ashford and St Peter's Hospitals NHS Foundation Trust",
    }
    cy.request("POST", "/api/test-endpoints/test-send-sign-up-email", {
      organisation,
      email: "nhs-person1@nhs.co.uk",
      password: Cypress.env("signUpPassword"),
      confirmPassword: Cypress.env("signUpPassword")
    })
      .then(res => {
        const link = res.body.link;
        cy.visit(link);
        cy.visit(link)
      })
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