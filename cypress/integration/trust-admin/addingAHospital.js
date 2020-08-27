import { whenIClickLogOut } from "../commonSteps";
import {
  GivenIAmLoggedInAsATrustAdmin,
  ThenISeeTheHospitalsPage,
  WhenIClickHospitalsOnTheNavigationBar,
} from "./trustAdminCommonSteps";

describe("As a trust admin, I want to add a hospital so that I can manage virtual visits per hospital.", () => {
  afterEach(() => {
    whenIClickLogOut();
  });

  it("allows a trust admin to add a hospital", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    cy.audit();

    WhenIClickAddAHospital();
    ThenISeeTheAddAHospitalForm();

    cy.audit();

    WhenIFillOutTheForm();
    AndISubmitTheForm();
    ThenISeeTheHospitalIsAdded();
    WhenIClickToGoToTheAddedHospital();
    ThenISeeTheAddedHospitalPage();

    cy.audit();
  });

  it("displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickAddAHospital();
    ThenISeeTheAddAHospitalForm();

    WhenISubmitFormWithoutFillingAnythingOut();
    ThenISeeErrors();
  });

  it("displays errors when survey url is invalid", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickAddAHospital();
    ThenISeeTheAddAHospitalForm();

    WhenIFillOutTheFormWithBadSurveyUrl();
    AndISubmitTheForm();
    ThenISeeErrors();
  });

  it("displays errors when support url is invalid", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickAddAHospital();
    ThenISeeTheAddAHospitalForm();

    WhenIFillOutTheFormWithBadSupportUrl();
    AndISubmitTheForm();
    ThenISeeErrors();
  });

  function WhenIClickAddAHospital() {
    cy.get("a").contains("Add a hospital").click();
  }

  function ThenISeeTheAddAHospitalForm() {
    cy.get("h1").should("contain", "Add a hospital");
  }

  function WhenIFillOutTheForm() {
    cy.get("input[name=hospital-name]").type("Scorpia Hospital");
    cy.get("input[name=hospital-survey-url]").type(
      "https://www.survey.example.com"
    );
    cy.get("input[name=hospital-support-url]").type(
      "https://www.support.example.com"
    );
  }

  function WhenIFillOutTheFormWithBadSurveyUrl() {
    cy.get("input[name=hospital-name]").type("Scorpia Hospital");
    cy.get("input[name=hospital-survey-url]").type("https://www");
  }

  function WhenIFillOutTheFormWithBadSupportUrl() {
    cy.get("input[name=hospital-name]").type("Scorpia Hospital");
    cy.get("input[name=hospital-support-url]").type("https://www");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Add hospital").click();
  }

  function ThenISeeTheHospitalIsAdded() {
    cy.get("h1").should("contain", "Scorpia Hospital has been added");
  }

  function WhenIClickToGoToTheAddedHospital() {
    cy.get("a").contains("Go to Scorpia Hospital").click();
  }

  function ThenISeeTheAddedHospitalPage() {
    cy.get("h1").should("contain", "Scorpia Hospital");
  }

  // Displays errors when fields have been left blank
  function WhenISubmitFormWithoutFillingAnythingOut() {
    cy.get("button").contains("Add hospital").click();
  }

  function ThenISeeErrors() {
    cy.contains("There is a problem").should("be.visible");
  }
});
