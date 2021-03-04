import { 
  ThenISeeAnError,
} from "../commonSteps";

describe("As manager of a trust, I can authorise another manager to gain access to the trust", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset:mssql && npm run dbmigratetest up:mssql"
    );
  });

  it("given a invalid authorisation link, shows an error", () => {
    GivenIVisitAnInvalidAuthorisationLink();
    ThenISeeAnError();
    cy.audit();
  });

  it("given a valid authorisation link, a manager visits the authorisation page, and authorises the user", () => {
    GivenIVisitAValidAuthorisationLink();
    ThenISeeAuthorisationPage();

    WhenIClickTheAuthorisationButton();
    ThenISeeTheAuthorisationSuccessPage();
  });

  it("given a valid authorisation link, a manager can only use the link once", () => {
    GivenIVisitAValidAuthorisationLinkTwice();
    ThenISeeAnError();
    cy.audit();
  });

  function GivenIVisitAnInvalidAuthorisationLink() {
    cy.visit(
      Cypress.env("baseUrl") + "/authorise-user/" + "huihiuhiusnefiubi.cisojsoide"
    );
  }

  function GivenIVisitAValidAuthorisationLink() {
    const organisation = {
      id: Cypress.env("signUpExistingOrganisationId"),
      name: Cypress.env("signUpExistingOrganisation"),
      status: 1,
    };
    cy.request("POST", "/api/test-endpoints/test-send-sign-up-email", {
      organisation,
      email: Cypress.env("signUpManagerEmail"),
      password: Cypress.env("signUpPassword"),
      confirmPassword: Cypress.env("signUpPassword"),
    }).then(res => {
      const link = res.body.link;
      cy.visit(link);
    });
  }

  function ThenISeeAuthorisationPage() {
    cy.get("[data-cy=page-heading").should("contain", "Authorise Account");
  }

  function WhenIClickTheAuthorisationButton() {
    cy.get("button").contains("Authorise").click();
  }

  function ThenISeeTheAuthorisationSuccessPage() {
    cy.get("[data-cy=panel-success-header]").should(
      "contain", 
      `Email has been sent to ${Cypress.env("signUpManagerEmail")}`
    );
  }

  function GivenIVisitAValidAuthorisationLinkTwice() {
    const organisation = {
      id: Cypress.env("signUpExistingOrganisationId"),
      name: Cypress.env("signUpExistingOrganisation"),
      status: 1,
    };
    cy.request("POST", "/api/test-endpoints/test-send-sign-up-email", {
      organisation,
      email: "nhs-person1@nhs.co.uk",
      password: Cypress.env("signUpPassword"),
      confirmPassword: Cypress.env("signUpPassword"),
    }).then(res => {
      const link = res.body.link;
      cy.visit(link);
      cy.visit(link);
    });
  }
});