describe("As a patient's key contact, I want to attend a virtual visit so that I can speak with my loved one.", () => {
  it("allows a key contact to attend a virtual visit", () => {
    GivenIAmAKeyContact();
    WhenIVisitTheAttendAVirtualVisitPageWithACallPassword();
    ThenISeeTheAttendAVirtualStartPage();
    cy.audit();

    WhenIClickOnStartNow();
    ThenISeeTheWhatIsYourNamePage();
    cy.audit();

    WhenIEnterMyName();
    AndISubmitTheForm();
    ThenISeeAVideoFrame();
    AndISeeAnEndCallButton();
    cy.audit();

    WhenIClickOnEndCall();
    ThenISeeTheVirtualVisitIsCompleted();
    cy.audit();
    AndIDoNotSeeLinksForWardStaff();
  });

  it("displays errors when fields have been left blank", () => {
    GivenIAmAKeyContact();
    WhenIVisitTheAttendAVirtualVisitPageWithACallPassword();
    ThenISeeTheAttendAVirtualStartPage();

    WhenIClickOnStartNow();
    ThenISeeTheWhatIsYourNamePage();

    WhenISubmitFormWithoutFillingAnythingOut();
    ThenISeeAnError();
  });

  // Allows a key contact to attend a virtual visit
  function GivenIAmAKeyContact() {}

  function WhenIVisitTheAttendAVirtualVisitPageWithACallPassword() {
    cy.visit("http://localhost:3001/visitors/123/start?callPassword=password");
  }

  function ThenISeeTheAttendAVirtualStartPage() {
    cy.get("h1").should("contain", "Attend a virtual visit");
  }

  function WhenIClickOnStartNow() {
    cy.get("button").contains("Start now").click();
  }

  function ThenISeeTheWhatIsYourNamePage() {
    cy.get("h1").should("contain", "What is your name?");
  }

  function WhenIEnterMyName() {
    cy.get("input").type("Perfuma");
  }

  function AndISubmitTheForm() {
    cy.get("button").contains("Attend visit").click();
  }

  function ThenISeeAVideoFrame() {
    cy.get("iframe", { timeout: cy.pageLoadTimeout }).should("be.visible");
  }

  function AndISeeAnEndCallButton() {
    cy.get("button").contains("End call").should("be.visible");
  }

  function WhenIClickOnEndCall() {
    cy.get("button").contains("End call").click();
  }

  function ThenISeeTheVirtualVisitIsCompleted() {
    cy.get("h1").should("contain", "Your virtual visit has completed");
  }

  function AndIDoNotSeeLinksForWardStaff() {
    cy.get("Return to virtual visits").should("not.be.visible");
    cy.get("Rebook another virtual visit").should("not.be.visible");
  }

  // Displays errors when fields have been left blank
  function WhenISubmitFormWithoutFillingAnythingOut() {
    cy.get("button").contains("Attend visit").click();
  }

  function ThenISeeAnError() {
    cy.contains("There is a problem").should("be.visible");
  }
});
