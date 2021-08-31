import { 
  ThenISeeAnError,
} from "../commonSteps";

describe("As manager of a trust, I can authorise another manager to gain access to the trust", () => {
  let link; 

  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset:mssql && npm run dbmigratetest up:mssql"
    );
  });

  it("given an invalid authorisation link, shows an error", () => {
    GivenIVisitAnInvalidAuthorisationLink();
    ThenISeeAnError();
    cy.audit();
  });

  it("given a valid authorisation link, a manager visits the authorisation page, and authorises the user", () => {
    GivenIVisitAValidAuthorisationLink();
    ThenISeeAuthorisationPage();
    cy.audit();

    WhenIClickTheAuthorisationButton();
    ThenISeeTheAuthorisationSuccessPage();
    cy.audit();
  });

  it("given a valid authorisation link, a manager can only use the link once", () => {
    GivenIVisitAValidAuthorisationLinkASecondTime();
    ThenISeeAnError();
    cy.audit();
  });

  function GivenIVisitAnInvalidAuthorisationLink() {
    cy.visit(
      Cypress.env("baseUrl") + "/authorise-user/" + "huihiuhiusnefiubi.cisojsoide"
    );
  }

  function GivenIVisitAValidAuthorisationLink() {
    cy.request("POST", "/api/test-endpoints/test-send-sign-up-email", { type: "authorisation" })
      .then(res => {
        link = res.body.link;
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

  function GivenIVisitAValidAuthorisationLinkASecondTime() {
    cy.visit(link);
  }
});