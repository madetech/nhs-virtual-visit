import {
  GivenIAmLoggedInAsATrustAdmin,
  ThenISeeTheEditAWardForm,
  ThenISeeThePageForTheHospital,
  WhenIClickHospitalsOnTheNavigationBar,
  WhenIClickOnAHospital,
} from "./trustAdminCommonSteps";
import { thenIClickLogOut } from "../commonSteps";

xdescribe("As a trust admin, I want to edit a ward so that I can modify the details of a ward.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickOnAHospital();
    ThenISeeThePageForTheHospital();

    WhenIClickToEditADifferentWard();
    ThenISeeTheEditAWardForm();

    WhenISubmitFormWithoutFillingAnythingOut();
    ThenISeeErrors();

    thenIClickLogOut();
  });

  function ThenISeeTheHospitalsPage() {
    cy.get("h1").should("contain", "Hospitals");
  }
  // Displays errors when fields have been left blank
  function WhenIClickToEditADifferentWard() {
    cy.get("a").contains("Edit Test Ward Two").click();
  }

  function WhenISubmitFormWithoutFillingAnythingOut() {
    cy.get("input[name=ward-name]").clear();
    cy.get("button").contains("Edit ward").click();
  }

  function ThenISeeErrors() {
    cy.contains("There is a problem").should("be.visible");
  }
});
