import refreshToken from "./refreshToken";
import moment from "moment";

describe("verifyAdminToken", () => {
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
      refreshedToken,
      refreshedEncodedToken,
      isTokenRefreshed,
    } = refreshToken(container)(authenticationToken);

    expect(isTokenRefreshed).toEqual(false);
    expect(refreshedToken).toBeUndefined;
    expect(refreshedEncodedToken).toBeUndefined;
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
      refreshedToken,
      refreshedEncodedToken,
      isTokenRefreshed,
    } = refreshToken(container)(authenticationToken);

    expect(isTokenRefreshed).toEqual(true);
    expect(refreshedToken).toEqual(authenticationToken);
    expect(refreshedEncodedToken).toBe("newEncodedToken");
  });
});
