import { thenIClickLogOut, ThenISeeAnError } from "../commonSteps";

import {
  GivenIAmLoggedInAsAnAdmin,
  ThenISeeTheSiteAdministrationPage,
  WhenIClickToReturnToSiteAdministration,
} from "./adminCommonSteps";

describe("As an admin, I want to add a trust so that a trust can use the virtual visits service.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset:mssql && npm run dbmigratetest up:mssql"
    );
  });

  it("allows an admin to add a trust", () => {
    GivenIAmLoggedInAsAnAdmin();
    WhenIClickOnViewAllTrusts();
    ThenISeeAListOfTrusts();
    WhenIClickOnAddATrust();
    ThenISeeTheAddATrustForm();

    cy.audit();

    WhenIFillOutTheForm();
    AndISubmitTheForm();
    ThenISeeTheTrustIsAdded();

    cy.audit();

    WhenIClickToReturnToSiteAdministration();
    ThenISeeTheSiteAdministrationPage();
    WhenIClickOnViewAllTrusts();
    AndISeeTheAddedTrust();

    thenIClickLogOut();
  });

  it("displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsAnAdmin();
    WhenIClickOnViewAllTrusts();
    ThenISeeAListOfTrusts();
    WhenIClickOnAddATrust();
    ThenISeeTheAddATrustForm();

    WhenISubmitFormWithoutFillingAnythingOut();
    ThenISeeAnError();

    thenIClickLogOut();
  });

  function WhenIClickOnViewAllTrusts() {
    cy.get("a.nhsuk-action-link__link").contains("View all trusts").click();
  }

  function WhenIClickOnAddATrust() {
    cy.get("a.nhsuk-action-link__link").contains("Add a trust").click();
  }

  function ThenISeeTheAddATrustForm() {
    cy.get("h1").should("contain", "Add a trust");
  }

  function WhenIFillOutTheForm() {
    cy.get("input[name=trust-name]").type("AAA Trust");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Add trust").click();
  }

  function ThenISeeTheTrustIsAdded() {
    cy.get("h1").should("contain", "AAA Trust has been added");
  }

  function ThenISeeAListOfTrusts() {
    cy.get("h1").should("contain", "List of all trusts");
  }

  function AndISeeTheAddedTrust() {
    cy.get("td").should("contain", "AAA Trust");
  }

  // Displays errors when fields have been left blank
  function WhenISubmitFormWithoutFillingAnythingOut() {
    cy.get("button").contains("Add trust").click();
  }
});
