import { getServerSideProps } from "../../../pages/reset-password/[token]";

describe("/reset-password/[token]", () => {
  describe("getServerSideProps", () => {
    it("returns email and empty tokenError as props", async () => {
      const verifyTimeSensitiveLinkSpy = jest.fn(async () => {
        return {
          user: {
            user_id: 1,
            email: "test@email.com",
          },
          error: "",
        };
      });

      const updateUserVerificationToVerified = jest.fn(async () => {
        return { 
          success: true,
          error: null,
        };
      });

      const container = {
        getVerifyTimeSensitiveLink: () => verifyTimeSensitiveLinkSpy,
        getUpdateUserVerificationToVerified: () => updateUserVerificationToVerified,
      };

      const { props } = await getServerSideProps({
        query: { token: "valid token" },
        container,
      });

      expect(props.email).toEqual("test@email.com");
      expect(props.error).toBeNull();
    });
  });

  it("returns an error as props when token is invalid", async () => {
    const verifyTimeSensitiveLink = jest.fn(async () => {
      return {
        user: null,
        error: "Token is invalid.",
      };
    });

    const updateUserVerificationToVerified = jest.fn(async () => {
      return { 
        success: true,
        error: null,
      };
    });

    const container = {
      getVerifyTimeSensitiveLink: () => verifyTimeSensitiveLink,
      getUpdateUserVerificationToVerified: () => updateUserVerificationToVerified,
    };  
    
    const { props } = await getServerSideProps({
      query: { token: "invalid token" },
      container,
    });

    expect(props.email).toBeNull();
    expect(props.error).toEqual("Token is invalid.");
  });

  it("returns empty email and a tokenError as props when token is invalid", async () => {
    const verifyTimeSensitiveLink = jest.fn(async () => {
      return {
        user: {
          user_id: 1,
          email: "test@email.com",
        },
        error: "",
      };
    });

    const updateUserVerificationToVerified = jest.fn(async () => {
      return { 
        success: false,
        error: "There was an error.",
      };
    });

    const container = {
      getVerifyTimeSensitiveLink: () => verifyTimeSensitiveLink,
      getUpdateUserVerificationToVerified: () => updateUserVerificationToVerified,
    };  
    
    const { props } = await getServerSideProps({
      query: { token: "invalid token" },
      container,
    });

    expect(props.email).toBeNull();
    expect(props.error).toEqual("There was an error.");
  });
});
