import { thenIClickLogOut } from "../commonSteps";
import {
  AndISubmitTheAddWardForm,
  AndISubmitTheEditWardForm,
  GivenIAmLoggedInAsATrustAdmin,
  ThenISeeTheAddAWardForm,
  ThenISeeTheEditAWardForm,
  ThenISeeTheHospitalsPage,
  ThenISeeThePageForTheHospital,
  ThenISeeTheWardIsDeleted,
  WhenIClickHospitalsOnTheNavigationBar,
  WhenIClickOnAddAWard,
  WhenIClickOnAHospital,
  WhenIClickToDeleteAWard,
  WhenIClickToEditAWard,
  WhenIClickToReturnToThePageForTheHospital,
  WhenIFillOutTheAddWardForm,
} from "./trustAdminCommonSteps";

describe("As a trust admin, I want to add, edit and delete  a ward so that ward staff can book virtual visits.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows a trust admin to add, edit and delete a ward", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickHospitalsOnTheNavigationBar();
    ThenISeeTheHospitalsPage();

    cy.audit();
    cy.log("Given I am on the add ward form");
    WhenIClickOnAHospital();
    ThenISeeThePageForTheHospital();

    WhenIClickOnAddAWard();
    ThenISeeTheAddAWardForm();

    cy.audit();

    let glimmerWard = "Glimmer Ward";
    cy.log("when I fill out the form to add a new ward and submit it");
    WhenIFillOutTheAddWardForm(glimmerWard);
    AndISubmitTheAddWardForm();
    cy.log("then i expect to see the added ward");
    ThenISeeTheWardIsAdded(glimmerWard);

    WhenIClickToReturnToThePageForTheHospital();
    ThenISeeThePageForTheHospital();
    AndISeeTheAddedWard(glimmerWard);

    cy.log("given I am on the edit ward form");
    WhenIClickToEditAWard(glimmerWard);
    ThenISeeTheEditAWardForm();
    cy.audit();
    let newWardName = "new Name";
    cy.log("when I edit the ward and submit");
    WhenIFillOutTheForm(newWardName);
    AndISubmitTheEditWardForm();
    cy.log("then I expect to see the updated ward");
    ThenISeeTheWardIsUpdated(newWardName);
    WhenIClickToReturnToThePageForTheHospital();

    cy.log("when I click delete ward");
    WhenIClickToDeleteAWard(newWardName);
    cy.log("then I expect to see the delete ward confirmation page");
    ThenISeeTheDeleteAWardConfirmationPage();
    cy.audit();
    cy.log("and when I confirm deletion of the ward");
    WhenIConfirmIWantToDeleteThisWard();
    cy.log("then I expect to see that the ward is deleted");
    ThenISeeTheWardIsDeleted(newWardName);
    cy.log("and that it is no longer a part of the hospital");
    WhenIClickToReturnToThePageForTheHospital();
    ThenISeeThePageForTheHospital();
    AndIDoNotSeeTheDeletedWard(newWardName);

    thenIClickLogOut();
  });
});

function AndIDoNotSeeTheDeletedWard(name) {
  cy.get("td").should("not.contain", name);
}

function WhenIConfirmIWantToDeleteThisWard() {
  cy.get("button").contains("Yes, delete this ward").click();
}

function ThenISeeTheDeleteAWardConfirmationPage() {
  cy.get("h1").should("contain", "Are you sure you want to delete this ward?");
}

function ThenISeeTheWardIsUpdated(name) {
  cy.get("h1").should("contain", `${name} has been updated`);
}

function WhenIFillOutTheForm(newName) {
  cy.get("input[name=ward-name]").clear();
  cy.get("input[name=ward-name]").type(newName);
}

function ThenISeeTheWardIsAdded(name) {
  cy.get("h1").contains(`${name} has been added`);
}

function AndISeeTheAddedWard(name) {
  cy.get("td").should("contain", name);
}
