import regenerateToken from "./regenerateToken";
import moment from "moment";

describe("regenerateToken", () => {
  it("it doesn't refresh the token if outside the refresh timeframe", () => {
    const authenticationToken = {
      type: "admin",
      exp: moment().subtract(4, "hours").unix(),
    };

    const tokenProvider = {
      validate: jest.fn(() => authenticationToken),
      generate: jest.fn(() => "encodedToken"),
    };
    const container = {
      getTokenProvider: () => tokenProvider,
    };
    const {
      regeneratedToken,
      regeneratedEncodedToken,
      isTokenRegenerated,
    } = regenerateToken(container)(authenticationToken);

    expect(isTokenRegenerated).toEqual(false);
    expect(regeneratedToken).toBeUndefined;
    expect(regeneratedEncodedToken).toBeUndefined;
  });

  it("it returns a new token if within the refresh timeframe", () => {
    const authenticationToken = {
      type: "admin",
      exp: moment().add(10, "minutes").unix(),
    };

    const tokenProvider = {
      validate: jest.fn(() => authenticationToken),
      generate: jest.fn(() => "newEncodedToken"),
    };
    const container = {
      getTokenProvider: () => tokenProvider,
    };
    const {
      regeneratedToken,
      regeneratedEncodedToken,
      isTokenRegenerated,
    } = regenerateToken(container)(authenticationToken);

    expect(isTokenRegenerated).toEqual(true);
    expect(regeneratedToken).toEqual(authenticationToken);
    expect(regeneratedEncodedToken).toBe("newEncodedToken");
  });
});
