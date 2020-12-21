import featureIsEnabled from "../../src/helpers/featureFlag";

describe("featureFlag", () => {
  it("returns true if env var for feature is set to yes", () => {
    process.env.FEATURE_FLAG_COOL_FEATURE = "true";
    expect(featureIsEnabled("FEATURE_FLAG_COOL_FEATURE")).toBeTruthy();
  });

  it("returns false if env var for feature is set to no", () => {
    process.env.FEATURE_FLAG_COOL_FEATURE = "false";
    expect(featureIsEnabled("FEATURE_FLAG_COOL_FEATURE")).toBeFalsy();
  });

  it("returns false if env var for feature is not set", () => {
    expect(featureIsEnabled("FEATURE_FLAG_TEST_FEATURE")).toBeFalsy();
  });
});
