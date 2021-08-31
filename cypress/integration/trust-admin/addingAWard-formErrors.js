import { thenIClickLogOut, ThenISeeAnError } from "../commonSteps";
import {
  GivenIAmLoggedInAsATrustAdmin,
  ThenISeeTheAddAWardForm,
  ThenISeeTheHospitalsPage,
  ThenISeeThePageForTheHospital,
  WhenIClickHospitalsOnTheNavigationBar,
  WhenIClickOnAddAWard,
  WhenIClickOnAHospital,
} from "./trustAdminCommonSteps";

describe("As a trust admin, I want to add a ward so that ward staff can book virtual visits.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset:mssql && npm run dbmigratetest up:mssql"
    );
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
    ThenISeeAnError();

    thenIClickLogOut();
  });

  // Displays errors when fields have been left blank
  function WhenISubmitFormWithoutFillingAnythingOut() {
    cy.get("button").contains("Add ward").click();
  }
});
