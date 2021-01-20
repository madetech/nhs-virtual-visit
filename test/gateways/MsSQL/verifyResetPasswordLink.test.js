import verifyResetPasswordLink from "../../../src/gateways/MsSQL/verifyResetPasswordLink";
import moment from "moment";
import retrieveEmailAndHashedPassword from "../../../src/gateways/MsSQL/retrieveEmailAndHashedPassword";

jest.mock("../../../src/gateways/MsSQL/retrieveEmailAndHashedPassword");

describe("verifyResetPasswordLink", () => {
  it("returns an email address if the link is valid", async () => {
    const token = {
      emailAddress: "test@email.com",
      exp: moment().add(2, "hours").unix(),
    };
    const tokenProvider = {
      retrieveEmailFromToken: jest.fn(() => {
        return { emailAddress: token.emailAddress };
      }),
      verifyTokenFromLink: jest.fn(() => {
        return { decryptedToken: token, errorToken: "" };
      }),
    };

    retrieveEmailAndHashedPassword.mockImplementation(() => {
      return { hashedPassword: "hashedPassword" };
    });
    const container = { getTokenProvider: () => tokenProvider };
    const { email, error } = await verifyResetPasswordLink(container)(token);

    expect(email).toEqual("test@email.com");
    expect(error).toBeNull();
  });

  it("returns an error it there is no email in the token", async () => {
    const token = {
      emailAddress: "",
      exp: moment().add(2, "hours").unix(),
    };
    const tokenProvider = {
      retrieveEmailFromToken: jest.fn(() => {
        return { emailAddress: token.emailAddress };
      }),
      verifyTokenNotUsed: jest.fn(() => {
        return { decryptedToken: token, errorToken: "" };
      }),
    };

    retrieveEmailAndHashedPassword.mockImplementation(() => {
      return { hashedPassword: "hashedPassword" };
    });
    const container = { getTokenProvider: () => tokenProvider };
    const { email, error } = await verifyResetPasswordLink(container)(token);

    expect(email).toEqual("");
    expect(error).toEqual("Email address does not exist");
  });

  it("returns an error if the link has been used", async () => {
    const token = {
      emailAddress: "test@email.com",
      exp: moment().add(2, "hours").unix(),
    };
    const tokenProvider = {
      retrieveEmailFromToken: jest.fn(() => {
        return { emailAddress: token.emailAddress };
      }),
      verifyTokenFromLink: jest.fn(() => {
        return { decryptedToken: "", errorToken: "error" };
      }),
    };

    retrieveEmailAndHashedPassword.mockImplementation(() => {
      return { hashedPassword: "hashedPassword" };
    });
    const container = { getTokenProvider: () => tokenProvider };
    const { email, error } = await verifyResetPasswordLink(container)(token);

    expect(email).toBeFalsy();
    expect(error).toEqual(
      "Link is incorrect or expired. Please reset password again"
    );
  });
});
