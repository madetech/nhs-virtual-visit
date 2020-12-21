import regenerateToken from "../../src/usecases/regenerateToken";
import moment from "moment";

describe("regenerateToken", () => {
  it("doesn't refresh the token when now is before the expiry window", () => {
    const authenticationToken = {
      type: "admin",
      exp: moment().add(24, "hours").unix(), // expires in 24 hours
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
    expect(regeneratedToken).toBeNull();
    expect(regeneratedEncodedToken).toBeNull();
  });

  it("doesn't refresh the token when now is after the expiry window", () => {
    const authenticationToken = {
      type: "admin",
      exp: moment().subtract(4, "hours").unix(), // expired 4 hours ago
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
    expect(regeneratedToken).toBeNull();
    expect(regeneratedEncodedToken).toBeNull();
  });

  it("returns a new token if now is within the expiry window", () => {
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
