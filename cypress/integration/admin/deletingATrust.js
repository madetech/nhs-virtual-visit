import { thenIClickLogOut } from "../commonSteps";

import { GivenIAmLoggedInAsAnAdmin } from "./adminCommonSteps";

xdescribe("As an admin, I want to delete a trust", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  it("allows an admin to delete a trust", () => {
    GivenIAmLoggedInAsAnAdmin();
    WhenIViewAllTrusts();
    WhenIClickToDeleteATrust();
    ThenISeeTheDeleteATrustForm();

    cy.audit();

    AndISubmitTheForm();
    ThenISeeTheTrustIsDeleted();

    cy.audit();

    thenIClickLogOut();
  });

  function WhenIViewAllTrusts() {
    cy.get("a.nhsuk-action-link__link").contains("View all trusts").click();
  }

  function WhenIClickToDeleteATrust() {
    cy.contains("Delete Test Hospital").click();
  }

  function ThenISeeTheDeleteATrustForm() {
    cy.get("h2").should(
      "contain",
      "Are you sure you want to delete Test Hospital?"
    );
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Yes").click();
  }

  function ThenISeeTheTrustIsDeleted() {
    cy.contains("Delete Test Hospital").should("not.exist");
  }
});
