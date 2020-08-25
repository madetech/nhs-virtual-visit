import {
  GivenIAmLoggedInAsATrustAdmin,
  ThenISeeTheHospitalsPage,
  ThenISeeThePageForTheHospital,
  WhenIClickHospitalsOnTheNavigationBar,
  WhenIClickToReturnToThePageForTheHospital,
} from "./trustAdminCommonSteps";
import { whenIClickLogOut } from "../commonSteps";

describe("As a trust admin, I want to delete a ward so that it can no longer use the virtual visits service.", () => {
  after(() => {
    whenIClickLogOut();
  });

  it("allows a trust admin to delete a ward", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    WhenIClickOnAHospital();
    ThenISeeThePageForTheHospital();

    WhenIClickToDeleteAWard();
    ThenISeeTheDeleteAWardConfirmationPage();
    cy.audit();

    WhenIConfirmIWantToDeleteThisWard();
    ThenISeeTheWardIsDeleted();

    WhenIClickToReturnToThePageForTheHospital();
    ThenISeeThePageForTheHospital();
    AndIDoNotSeeTheDeletedWard();
  });

  function WhenIClickOnAHospital() {
    cy.get("a").contains("View Test Hospital").click();
  }

  function WhenIClickToDeleteAWard() {
    cy.get("a").contains("Delete Test Ward One").click();
  }

  function ThenISeeTheDeleteAWardConfirmationPage() {
    cy.get("h1").should(
      "contain",
      "Are you sure you want to delete this ward?"
    );
  }

  function WhenIConfirmIWantToDeleteThisWard() {
    cy.get("button").contains("Yes, delete this ward").click();
  }

  function ThenISeeTheWardIsDeleted() {
    cy.get("h1").should("contain", "Test Ward One has been deleted");
  }

  function AndIDoNotSeeTheDeletedWard() {
    cy.get("td").should("not.contain", "Test Ward One");
  }
});
