import verifyResetPasswordLink from "../../../src/gateways/MsSQL/verifyResetPasswordLink";
import moment from "moment";
// import retrieveEmailAndHashedPassword from "../../../src/gateways/MsSQL/retrieveEmailAndHashedPassword";

describe("verifyResetPasswordLink", () => {
  xit("returns an email address if the link is valid", () => {
    const token = {
      emailAddress: "test@email.com",
      exp: moment().add(2, "hours").unix(),
    };
    const tokenProvider = {
      retrieveEmailFromToken: jest.fn(() => token.emailAddress),
      verifyTokenNotUsed: jest.fn(() => {
        "";
      }),
    };

    // const retrieveEmailAndHashedPassword = jest.fn().mockReturnValue({
    //   hashedPassword: "hashedPassword",
    // });

    // verifyResetPasswordLink = {
    //   retrieveEmailAndHashedPassword: jest.fn(() => { hashedPassword: "hashedPassword" }),
    // }
    // retrieveEmailAndHashedPassword.mockReturnValue({
    //   hashedPasword: "hashedPassword",
    // });

    const container = { getTokenProvider: () => tokenProvider };

    const { email, error } = verifyResetPasswordLink(container)(token);
    expect(email).toEqual("test@email.com");
    expect(error).toEqual("");
  });
});
