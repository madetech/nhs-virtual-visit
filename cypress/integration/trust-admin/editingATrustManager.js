import { thenIClickLogOut } from "../commonSteps";
import {
  GivenIAmLoggedInAsATrustAdmin,
  WhenIClickOnTrustManagersOnTheNavigationBar,
  ThenISeeTheTrustManagersList,
} from "./trustAdminCommonSteps";

describe("As an admin, I want to edit a trust manager so that I can keep trust manager changes up to date.", () => {
  before(() => {
    // reset and seed the database
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
    cy.get("#edit-tm-link").contains("Edit").click();
  }

  function ThenISeeAnEditTrustManagerForm() {
    cy.get("#tm-form-heading").contains("Edit a Trust Manager");
  }

  function WhenIFillOutTheEditTMForm(status) {
    cy.get("#tm-select-status").select(status);
  }
  function AndIClickTheEditTrustManagerButton() {
    cy.get("button[type=submit]").contains("Edit a Trust Manager").click();
  }

  function ThenISeeTheTrustManagerIsUpdatedPage() {
    cy.get("#panel-updated-success").contains("has been updated");
  }
});
