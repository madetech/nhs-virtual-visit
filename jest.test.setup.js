import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import fetchMock from "jest-fetch-mock";
import dotenvLoad from "dotenv-load";

dotenvLoad();

// adds the 'fetchMock' global variable and rewires 'fetch' global to call 'fetchMock' instead of the real implementation
fetchMock.enableMocks();
// changes default behavior of fetchMock to use the real 'fetch' implementation and not mock responses
fetchMock.dontMock();

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
