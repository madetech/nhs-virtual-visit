import createTimeSensitiveLink from "../../src/helpers/createTimeSensitiveLink";
import TokenProvider from "../../src/providers/TokenProvider";

jest.mock("../../src/providers/TokenProvider");

describe("createTimeSensitiveLink", () => {
  it("returns a link with a time sensitive token", () => {
    const headers = { host: "rootUrl" };
    const id = "UUID";
    const expirationTime = "2h";
    const urlPath = "urlPath";
    const hashedPassword = "hashedPassword";

    TokenProvider.mockImplementation(() => {
      return { generateTokenForLink: jest.fn().mockReturnValue("token") };
    });

    const { link, linkError } = createTimeSensitiveLink(
      headers,
      id,
      expirationTime,
      urlPath,
      hashedPassword
    );

    expect(linkError).toBe(null);
    expect(link).toEqual("http://rootUrl/urlPath/token");
  });

  it("returns an error if the token isn't signed", () => {
    const headers = { host: "rootUrl" };
    const emailAddress = "test@email.com";
    const hashedPassword = "hashedPassword";
    const expirationTime = "2h";
    const urlPath = "urlPath";

    const generateTokenForLinkStub = jest.fn().mockImplementation(() => {
      throw new Error("Error");
    });
    TokenProvider.mockImplementation(() => {
      return { generateTokenForLink: generateTokenForLinkStub };
    });

    const { link, linkError } = createTimeSensitiveLink(
      headers,
      emailAddress,
      hashedPassword,
      expirationTime,
      urlPath
    );

    expect(linkError.message).toBe("Error");
    expect(link).toEqual("");
  });
});
