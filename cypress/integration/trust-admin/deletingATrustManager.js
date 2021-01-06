import { thenIClickLogOut } from "../commonSteps";
import {
  GivenIAmLoggedInAsATrustAdmin,
  WhenIClickOnTrustManagersOnTheNavigationBar,
  ThenISeeTheTrustManagersList,
} from "./trustAdminCommonSteps";

describe.skip("As an admin, I want to delete a trust manager so that I can remove a trust manager from the system.", () => {
  before(() => {
    // reset and seed the database: need to edit this to run MSSQL test DB and reseed
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows admin to delete a trust manager", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickOnTrustManagersOnTheNavigationBar();
    ThenISeeTheTrustManagersList();
    WhenIClickOnTheDeleteLink();
    ThenISeeADeleteTrustManagerPage();
    WhenIClickTheDeleteTrustManagerButton();
    ThenISeeTheTrustManagerIsDeletedPage();
    cy.audit();

    thenIClickLogOut();
  });

  function WhenIClickOnTheDeleteLink() {
    cy.get("[data-cy=delete-tm-link]").contains("Delete").click();
  }

  function ThenISeeADeleteTrustManagerPage() {
    cy.get("[data-cy=form-heading]").contains(
      "Are you sure you want to delete this trust manager?"
    );
  }

  function WhenIClickTheDeleteTrustManagerButton() {
    cy.get("[data-cy=button]")
      .contains("Yes, delete this trust manager")
      .click();
  }

  function ThenISeeTheTrustManagerIsDeletedPage() {
    cy.get("[data-cy=panel-success-header]").contains("has been deleted");
  }
});
