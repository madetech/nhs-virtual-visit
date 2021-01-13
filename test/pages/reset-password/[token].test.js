import { getServerSideProps } from "../../../pages/reset-password/[token]";

describe("/reset-password/[token]", () => {
  describe("getServerSideProps", () => {
    it("returns email and empty tokenError as props", async () => {
      const verifyResetPasswordLinkSpy = jest.fn(async () => {
        return {
          email: "test@email.com",
          error: "",
        };
      });

      const container = {
        getVerifyResetPasswordLink: () => verifyResetPasswordLinkSpy,
      };

      const { props } = await getServerSideProps({
        query: { token: "valid token" },
        container,
      });

      expect(props.email).toEqual("test@email.com");
      expect(props.tokenError).toEqual("");
    });
  });

  it("returns empty email and a tokenError as props when token is invalid", async () => {
    const verifyResetPasswordLinkSpy = jest.fn(async () => {
      return {
        email: "",
        error: "Token is invalid.",
      };
    });

    const container = {
      getVerifyResetPasswordLink: () => verifyResetPasswordLinkSpy,
    };

    const { props } = await getServerSideProps({
      query: { token: "invalid token" },
      container,
    });

    expect(props.email).toEqual("");
    expect(props.tokenError).toEqual("Token is invalid.");
  });
});
