import { thenIClickLogOut } from "../commonSteps";
import {
  GivenIAmLoggedInAsATrustAdmin,
  ThenISeeTheHospitalsPage,
  WhenIClickHospitalsOnTheNavigationBar,
} from "./trustAdminCommonSteps";

describe("As a trust admin, I want to add a hospital so that I can manage virtual visits per hospital.", () => {
  const hospitalName = "Scorpia Hospital";
  const hospitalCode = "SCH";

  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows a trust admin to add and edit a hospital", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    cy.audit();

    WhenIClickAddAHospital();
    ThenISeeTheAddAHospitalForm();

    cy.audit();

<<<<<<< HEAD

=======
>>>>>>> chore: edited e2e test and EditForm to separate edit and add hospital functionality
    WhenIFillOutTheAddForm(hospitalName, hospitalCode);
    AndISubmitTheForm();
    ThenISeeTheHospitalIsAdded(hospitalName);
    WhenIClickToGoToTheAddedHospital(hospitalName);
    ThenISeeTheAddedHospitalPage(hospitalName);

    cy.audit();

    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickOnTheEditLink(hospitalName);
    ThenIExpectTHeHospitalNameFieldToBePrePopulated(hospitalName);
<<<<<<< HEAD

    const newName = "new hospital name";
=======
    const newName = "new hopsital name";
>>>>>>> chore: edited e2e test and EditForm to separate edit and add hospital functionality
    WhenIFillOutTheEditForm(newName);
    AndIClickTheEditHospitalButton();

    ThenIShouldBeOnTheEditSuccessPageWithNewName(newName);
    thenIClickLogOut();
  });

  it("add hospital displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickAddAHospital();
    ThenISeeTheAddAHospitalForm();

    WhenISubmitFormWithoutFillingAnythingOut();
    ThenISeeErrors();

    thenIClickLogOut();
  });

  function WhenIClickAddAHospital() {
    cy.get("a").contains("Add a hospital").click();
  }

  function ThenISeeTheAddAHospitalForm() {
    cy.get("h2").should("contain", "Add a hospital");
  }

  function WhenIFillOutTheAddForm(name, newCode) {
    cy.get("input[name=hospital-name]").clear().type(name);
    cy.get("input[name=hospital-code]").clear().type(newCode);
  }

  function WhenIFillOutTheEditForm(name) {
    cy.get("input[name=hospital-name]").clear().type(name);
<<<<<<< HEAD
    cy.get("#nhs-dropdown-menu").select("2");
=======
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
>>>>>>> chore: edited e2e test and EditForm to separate edit and add hospital functionality
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
