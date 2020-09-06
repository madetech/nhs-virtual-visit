// import {
//   GivenIAmLoggedInAsAWardStaff,
//   ThenISeeTheCheckYourAnswersPage,
//   ThenISeeTheVirtualVisitsPage,
//   WhenIClickOnAVirtualVisit,
//   WhenIClickViewVirtualVisits,
// } from "./wardCommonSteps";
// import { whenIClickLogOut } from "../commonSteps";
//
// describe("As a ward staff, I want to edit a visit from the list screen so that I can change the details of a visit.", () => {
//   afterEach(() => {
//     whenIClickLogOut();
//   });
//
//
//
//   // function WhenIClickOnAVirtualVisit() {
//   //   cy.get("summary.nhsuk-details__summary").contains("Alice").click();
//   // }
//
//
//
//
//
//
//
//   function AndISubmitTheForm() {
//     cy.get("button").contains("Continue").click();
//   }
//
//   // function ThenISeeTheCheckYourAnswersPage() {
//   //   cy.get("h1").should(
//   //     "contain",
//   //     "Check your answers before editing a virtual visit"
//   //   );
//   // }
//
//
//   // function WhenIClickViewVirtualVisits() {
//   //   cy.get("a").contains("Return to virtual visits").click();
//   // }
//
//   // function ThenISeeTheVirtualVisitsPage() {
//   //   cy.get("h1").should("contain", "Virtual visits");
//   // }
//
//
//
//   // Displays errors when fields have been left blank
//   function WhenIClickOnAnotherVirtualVisit() {
//     cy.get("summary.nhsuk-details__summary").contains("Elliot").click();
//   }
//
//   function AndIClickOnEditForAnotherVirtualVisit() {
//     cy.get("summary.nhsuk-details__summary")
//       .contains("Elliot")
//       .parent()
//       .parent()
//       .within(() => {
//         cy.get("button").contains("Edit").click();
//       });
//   }
//
//   function WhenISubmitFormWithBlankFields() {
//     cy.get("input[name=patient-name]").clear();
//     cy.get("input[name=contact-name]").clear();
//     cy.get("button").contains("Continue").click();
//   }
//
//   function ThenISeeErrors() {
//     cy.contains("There is a problem").should("be.visible");
//   }
// });
