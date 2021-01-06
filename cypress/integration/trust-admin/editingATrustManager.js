import { thenIClickLogOut } from "../commonSteps";
import {
  GivenIAmLoggedInAsATrustAdmin,
  WhenIClickOnTrustManagersOnTheNavigationBar,
  ThenISeeTheTrustManagersList,
} from "./trustAdminCommonSteps";

describe.skip("As an admin, I want to edit a trust manager so that I can keep trust manager changes up to date.", () => {
  before(() => {
    // reset and seed the database: need to edit this to run MSSQL test DB and reseed
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows admin to edit the status of trust manager", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickOnTrustManagersOnTheNavigationBar();
    ThenISeeTheTrustManagersList();
    WhenIClickOnTheEditLink();
    ThenISeeAnEditTrustManagerForm();
    WhenIFillOutTheEditTMForm("disabled");
    AndIClickTheEditTrustManagerButton();
    ThenISeeTheTrustManagerIsUpdatedPage();
    cy.audit();

    WhenIClickOnTrustManagersOnTheNavigationBar();
    ThenISeeTheTrustManagersList();
    WhenIClickOnTheEditLink();
    ThenISeeAnEditTrustManagerForm();
    WhenIFillOutTheEditTMForm("active");
    AndIClickTheEditTrustManagerButton();
    ThenISeeTheTrustManagerIsUpdatedPage();
    thenIClickLogOut();
  });

  function WhenIClickOnTheEditLink() {
    cy.get("[data-cy=edit-tm-link]").contains("Edit").click();
  }

  function ThenISeeAnEditTrustManagerForm() {
    cy.get("[data-cy=form-heading]").contains("Edit a Trust Manager");
  }

  function WhenIFillOutTheEditTMForm(status) {
    cy.get("[data-cy=select-status]").select(status);
  }
  function AndIClickTheEditTrustManagerButton() {
    cy.get("[data-cy=tm-form-submit]").contains("Edit a Trust Manager").click();
  }

  function ThenISeeTheTrustManagerIsUpdatedPage() {
    cy.get("[data-cy=panel-success-header]").contains("has been updated");
  }
});
