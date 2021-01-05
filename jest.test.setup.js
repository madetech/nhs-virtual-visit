import "@testing-library/jest-dom";
// import dotenvLoad from "dotenv-load";

const dotenvLoad = require("dotenv-load");
dotenvLoad();

// dotenvLoad();

jest.mock(
  "./node_modules/nhsuk-frontend/packages/components/header/menuToggle",
  () => jest.fn()
);

expect.extend({
  orderlessEqual(received, expected) {
    const pass =
      received.length == expected.length &&
      this.equals(received, expect.arrayContaining(expected));

    if (pass) {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} not to equal ${this.utils.printExpected(
            expected
          )} disregarding order`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `expected ${this.utils.printReceived(
            received
          )} to equal ${this.utils.printExpected(expected)} disregarding order`,
        pass: false,
      };
    }
  },
});
