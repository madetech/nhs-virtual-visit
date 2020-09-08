import { whenIClickLogOut } from "../commonSteps";
import {
  GivenIAmLoggedInAsATrustAdmin,
  ThenISeeTheHospitalsPage,
  WhenIClickHospitalsOnTheNavigationBar,
} from "./trustAdminCommonSteps";

describe("As a trust admin, I want to add a hospital so that I can manage virtual visits per hospital.", () => {
  const hospitalName = "Scorpia Hospital";

  it("allows a trust admin to add and edit  a hospital", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    cy.audit();

    WhenIClickAddAHospital();
    ThenISeeTheAddAHospitalForm();

    cy.audit();

    WhenIFillOutTheForm(hospitalName);
    AndISubmitTheForm();
    ThenISeeTheHospitalIsAdded(hospitalName);
    WhenIClickToGoToTheAddedHospital(hospitalName);
    ThenISeeTheAddedHospitalPage(hospitalName);

    cy.audit();

    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickOnTheEditLink(hospitalName);
    ThenIExpectTHeHospitalNameFieldToBePrePopulated(hospitalName);
    const newName = "new hopsital name";
    WhenIFillOutTheForm(newName);
    AndIClickTheEditHospitalButton();

    ThenIShouldBeOnTheEditSuccessPageWithNewName(newName);
    whenIClickLogOut();
  });

  // it("allows an admin to edit a hospital", () => {
  //   GivenIAmLoggedInAsATrustAdmin();
  //   WhenIClickHospitalsOnTheNavigationBar();
  //   ThenISeeTheHospitalsPage();
  //
  //   WhenIClickOnTheEditLink(name);
  //   ThenIExpectTHeHospitalNameFieldToBePrePopulated(name);
  //   const newName = "new hopsital name";
  //   WhenIFillOutTheForm(newName);
  //   AndIClickTheEditHospitalButton();
  //   ThenIShouldBeOnTheEditSuccessPageWithNewName();
  // });

  it("add hospital displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickAddAHospital();
    ThenISeeTheAddAHospitalForm();

    WhenISubmitFormWithoutFillingAnythingOut();
    ThenISeeErrors();

    whenIClickLogOut();
  });

  it("add hospital displays errors when survey url is invalid", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickAddAHospital();
    ThenISeeTheAddAHospitalForm();

    WhenIFillOutTheFormWithBadSurveyUrl();
    AndISubmitTheForm();
    ThenISeeErrors();

    whenIClickLogOut();
  });

  it("add hospital displays errors when support url is invalid", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickAddAHospital();
    ThenISeeTheAddAHospitalForm();

    WhenIFillOutTheFormWithBadSupportUrl();
    AndISubmitTheForm();
    ThenISeeErrors();

    whenIClickLogOut();
  });

  function WhenIClickAddAHospital() {
    cy.get("a").contains("Add a hospital").click();
  }

  function ThenISeeTheAddAHospitalForm() {
    cy.get("h1").should("contain", "Add a hospital");
  }

  function WhenIFillOutTheForm(name) {
    cy.get("input[name=hospital-name]").clear().type(name);
    cy.get("input[name=hospital-survey-url]")
      .clear()
      .type("https://www.survey.example.com");
    cy.get("input[name=hospital-support-url]")
      .clear()
      .type("https://www.support.example.com");
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

  function ThenISeeTheHospitalIsAdded(name) {
    cy.get("h1").should("contain", `${name} has been added`);
  }

  function WhenIClickToGoToTheAddedHospital(name) {
    cy.get("a").contains(`Go to ${name}`).click();
  }

  function ThenISeeTheAddedHospitalPage(name) {
    cy.get("h1").should("contain", name);
  }

  // Displays errors when fields have been left blank
  function WhenISubmitFormWithoutFillingAnythingOut() {
    cy.get("button").contains("Add hospital").click();
  }

  function ThenISeeErrors() {
    cy.contains("There is a problem").should("be.visible");
  }

  function WhenIClickOnTheEditLink(name) {
    const element = `edit-${name.toLowerCase().replace(/\W+/g, "-")}`;

    cy.get(`[data-testid=${element}]`).click();
    // cy.get("a.nhsuk-link").contains("Edit").click();
  }

  function ThenIExpectTHeHospitalNameFieldToBePrePopulated(name) {
    cy.get("input[name=hospital-name]").should("have.value", name);
  }

  function AndIClickTheEditHospitalButton() {
    cy.get('[data-testid="editHospital"]').contains("Edit hospital").click();
  }

  function ThenIShouldBeOnTheEditSuccessPageWithNewName(name) {
    cy.get('[data-testid="name"]').should(
      "contain",
      `${name} has been updated`
    );
  }
});
