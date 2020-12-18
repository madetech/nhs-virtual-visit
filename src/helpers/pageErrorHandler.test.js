import { hasError, getErrorMessage } from "./pageErrorHandler";

describe("hasError", () => {
  it("returns the item when an error exists for the given field", () => {
    expect(
      hasError([{ id: "test-id-error" }, { id: "other-id-error" }], "test-id")
    ).toEqual({ id: "test-id-error" });
  });

  it("returns undefined when an error exists for the given field", () => {
    expect(hasError([{ id: "other-id-error" }], "test-id")).toEqual(undefined);
  });
});

describe("getErrorMessage", () => {
  it("returns the error message of the error when specified field has an error", () => {
    const errors = [
      { id: "test-id-error", message: "Mandatory field" },
      { id: "other-id-error", message: "Other mandatory field" },
    ];

    expect(getErrorMessage(errors, "test-id")).toEqual("Mandatory field");
  });

  it("returns empty string an error exists for the given field", () => {
    const errors = [{ id: "other-id-error", message: "Other mandatory field" }];

    expect(getErrorMessage(errors, "test-id")).toEqual("");
  });
});
