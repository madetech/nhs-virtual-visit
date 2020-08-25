import { whenIClickLogOut } from "../commonSteps";
import {
  GivenIAmLoggedInAsATrustAdmin,
  ThenISeeTheHospitalsPage,
  ThenISeeThePageForTheHospital,
  WhenIClickHospitalsOnTheNavigationBar,
  WhenIClickToReturnToThePageForTheHospital,
} from "./trustAdminCommonSteps";

describe("As a trust admin, I want to add a ward so that ward staff can book virtual visits.", () => {
  after(() => {
    whenIClickLogOut();
  });

  it("allows a trust admin to add a ward", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickOnAHospital();
    ThenISeeThePageForTheHospital();

    WhenIClickOnAddAWard();
    ThenISeeTheAddAWardForm();

    cy.audit();

    WhenIFillOutTheForm();
    AndISubmitTheForm();
    ThenISeeTheWardIsAdded();

    WhenIClickToReturnToThePageForTheHospital();
    ThenISeeThePageForTheHospital();
    AndISeeTheAddedWard();
  });

  it("displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickOnAHospital();
    ThenISeeThePageForTheHospital();

    WhenIClickOnAddAWard();
    ThenISeeTheAddAWardForm();

    WhenISubmitFormWithoutFillingAnythingOut();
    ThenISeeErrors();
  });

  function WhenIClickOnAHospital() {
    cy.get("a").contains("View Test Hospital").click();
  }

  function WhenIClickOnAddAWard() {
    cy.get("button").contains("Add a ward").click();
  }

  function ThenISeeTheAddAWardForm() {
    cy.get("h1").should("contain", "Add a ward");
  }

  function WhenIFillOutTheForm() {
    cy.get("input[name=ward-name]").type("Glimmer Ward");
    cy.get("input[name=ward-code]").type("glimmercode");
    cy.get("input[name=ward-code-confirmation]").type("glimmercode");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Add ward").click();
  }

  function ThenISeeTheWardIsAdded() {
    cy.get("h1").should("contain", "Glimmer Ward has been added");
  }

  function AndISeeTheAddedWard() {
    cy.get("td").should("contain", "Glimmer Ward");
  }

  // Displays errors when fields have been left blank
  function WhenISubmitFormWithoutFillingAnythingOut() {
    cy.get("button").contains("Add ward").click();
  }

  function ThenISeeErrors() {
    cy.contains("There is a problem").should("be.visible");
  }
});
