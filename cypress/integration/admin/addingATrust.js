import { thenIClickLogOut } from "../commonSteps";
import {
  GivenIAmLoggedInAsAnAdmin,
  ThenISeeTheSiteAdministrationPage,
  WhenIClickToReturnToSiteAdministration,
} from "./adminCommonSteps";

describe("As an admin, I want to add a trust so that a trust can use the virtual visits service.", () => {
  it("allows an admin to add a trust", () => {
    GivenIAmLoggedInAsAnAdmin();
    WhenIClickOnAddATrust();
    ThenISeeTheAddATrustForm();

    cy.audit();

    WhenIFillOutTheForm();
    AndISubmitTheForm();
    ThenISeeTheTrustIsAdded();

    cy.audit();

    WhenIClickToReturnToSiteAdministration();
    ThenISeeTheSiteAdministrationPage();
    AndISeeTheAddedTrust();

    thenIClickLogOut();
  });

  it("displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsAnAdmin();
    WhenIClickOnAddATrust();
    ThenISeeTheAddATrustForm();

    WhenISubmitFormWithoutFillingAnythingOut();
    ThenISeeErrors();

    thenIClickLogOut();
  });

  function WhenIClickOnAddATrust() {
    cy.get("a.nhsuk-action-link__link").contains("Add a trust").click();
  }

  function ThenISeeTheAddATrustForm() {
    cy.get("h1").should("contain", "Add a trust");
  }

  function WhenIFillOutTheForm() {
    cy.get("input[name=trust-name]").type("Bow Trust");
    cy.get("select[name=video-provider]").select("whereby");
    cy.get("input[name=trust-admin-code]").type("bowcode");
    cy.get("input[name=trust-password]").type("bowpassword");
    cy.get("input[name=trust-password-confirmation]").type("bowpassword");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Add trust").click();
  }

  function ThenISeeTheTrustIsAdded() {
    cy.get("h1").should("contain", "Bow Trust has been added");
  }

  function AndISeeTheAddedTrust() {
    cy.get("td").should("contain", "Bow Trust");
  }

  // Displays errors when fields have been left blank
  function WhenISubmitFormWithoutFillingAnythingOut() {
    cy.get("button").contains("Add trust").click();
  }

  function ThenISeeErrors() {
    cy.contains("There is a problem").should("be.visible");
  }
});
