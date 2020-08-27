import { whenIClickLogOut } from "../commonSteps";
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
  afterEach(() => {
    whenIClickLogOut();
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

  // Displays errors when fields have been left blank
  function WhenISubmitFormWithoutFillingAnythingOut() {
    cy.get("button").contains("Add ward").click();
  }

  function ThenISeeErrors() {
    cy.contains("There is a problem").should("be.visible");
  }
});
