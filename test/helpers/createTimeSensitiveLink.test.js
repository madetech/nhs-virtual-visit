import createTimeSensitiveLink from "../../src/helpers/createTimeSensitiveLink";
import jwt from "jsonwebtoken";

describe("createTimeSensitiveLink", () => {
  it("returns a link with a time sensitive token", () => {
    const headers = { host: "rootUrl" };
    const emailAddress = "test@email.com";
    const hashedPassword = "hashedPassword";
    const expirationTime = "2h";
    const urlPath = "urlPath";

    jwt.sign = jest.fn().mockReturnValue("token");

    const { link, linkError } = createTimeSensitiveLink(
      headers,
      emailAddress,
      hashedPassword,
      expirationTime,
      urlPath
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

    jwt.sign = jest.fn().mockImplementation(() => {
      throw new Error("Error");
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
