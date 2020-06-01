import "@testing-library/jest-dom";
import dotenvLoad from "dotenv-load";

dotenvLoad();

jest.mock(
  "./node_modules/nhsuk-frontend/packages/components/header/menuToggle",
  () => jest.fn()
);
