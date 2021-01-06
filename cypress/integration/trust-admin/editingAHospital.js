import { thenIClickLogOut } from "../commonSteps";
import { GivenIAmLoggedInAsATrustAdmin } from "./trustAdminCommonSteps.js";

xdescribe("As an admin, I want to edit a hospital so that I can keep hospital changes up to date.", () => {
  before(() => {
    // reset and seed the database
    cy.exec(
      "npm run dbmigratetest reset && npm run dbmigratetest up && npm run db:seed"
    );
  });

  function WhenIClickOnHospitals() {
    cy.get("a.nhsuk-header__navigation-link").contains("Hospitals").click();
  }

  function ThenISeeTheHospitalList() {
    cy.get("caption").should("contain", "List of hospitals");
  }

  function WhenIClickOnTheEditLink() {
    cy.get("a.nhsuk-link").contains("Edit").click();
  }

  function AndIClickTheEditHospitalButton() {
    cy.get("button[type=submit]").contains("Edit hospital").click();
  }

  function WhenISubmitFormEmptyHospitalName() {
    cy.get("input[name=hospital-name]").clear();
    AndIClickTheEditHospitalButton();
  }

  function ThenISeeErrors() {
    cy.get(".nhsuk-error-summary").should("be.visible");
  }

  it("displays errors when fields have been left blank", () => {
    GivenIAmLoggedInAsATrustAdmin();
    WhenIClickOnHospitals();
    ThenISeeTheHospitalList();

    WhenIClickOnTheEditLink();
    cy.audit();

    WhenISubmitFormEmptyHospitalName();
    ThenISeeErrors();

    thenIClickLogOut();
  });
});
