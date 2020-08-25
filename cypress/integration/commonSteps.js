module.exports = {
  whenIClickLogOut: () => {
    cy.get("a.nhsuk-header__navigation-link").contains("Log out").click();
  },
};
