import { thenIClickLogOut } from "../commonSteps";
import {
  GivenIAmLoggedInAsAnAdmin,
  ThenISeeTheSiteAdministrationPage,
} from "./adminCommonSteps";

describe("As an admin, I want to edit a trust so that I can update the details of a trust.", () => {
  it("allows an admin to edit a trust", () => {
    GivenIAmLoggedInAsAnAdmin();
    WhenIClickToEditATrust();
    ThenISeeTheEditATrustForm();

    cy.audit();

    WhenIUpdateTheVideoProvider();
    AndISubmitTheForm();
    ThenISeeTheTrustIsUpdated();

    cy.audit();

    WhenIClickToReturnToSiteAdministration();
    ThenISeeTheSiteAdministrationPage();
    AndISeeTheUpdatedTrust();

    thenIClickLogOut();
  });

  function WhenIClickToEditATrust() {
    cy.get("a.nhsuk-link").contains("Edit Test Trust").click();
  }

  function ThenISeeTheEditATrustForm() {
    cy.get("h1").should("contain", "Edit Test Trust");
  }

  function WhenIUpdateTheVideoProvider() {
    cy.get("select[name=video-provider]").select("whereby");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Edit Trust").click();
  }

  function ThenISeeTheTrustIsUpdated() {
    cy.get("h1").should("contain", "Test Trust has been updated");
  }

  function WhenIClickToReturnToSiteAdministration() {
    cy.get("a").contains("Return to site administration").click();
  }

  function AndISeeTheUpdatedTrust() {
    cy.get("[data-testid=test-trust]").should("contain", "Whereby");
  }
});
