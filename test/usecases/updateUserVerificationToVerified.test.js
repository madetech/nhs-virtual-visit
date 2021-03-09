import updateUserVerificationToVerified from "../../src/usecases/updateUserVerificationToVerified";
import logger from "../../logger";

describe("updateUserVerificationToVerified", () => {

  let hash;
  let getUpdateUserVerificationToVerifiedGateway;
  
  beforeEach(() => {
    hash = "hash";
    getUpdateUserVerificationToVerifiedGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        success: true,
        error: null,
      });
    });
  });

  it("returns an error if hash is not defined", async () => {
    hash = "";

    const { success, error } = await updateUserVerificationToVerified({
      getUpdateUserVerificationToVerifiedGateway,
      logger
    })({ hash });

    expect(success).toBeFalsy();
    expect(error).toEqual("hash is not defined");
  });

  it("return success if the verified column gets updated by db call", async () => {
    const getUpdateUserVerificationToVerifiedGatewaySpy = jest
      .fn()
      .mockReturnValue({
        success: true,
        error: null,
      });

    getUpdateUserVerificationToVerifiedGateway = jest.fn(() => {
      return getUpdateUserVerificationToVerifiedGatewaySpy;
    })
    
    const { success, error } = await updateUserVerificationToVerified({
      getUpdateUserVerificationToVerifiedGateway,
      logger
    })({ hash });

    expect(success).toBeTruthy();
    expect(error).toBeNull();
    expect(getUpdateUserVerificationToVerifiedGatewaySpy).toHaveBeenCalledWith({
      hash: "hash",
      verified: true,
    });
  });

  it("returns an error if there is problem with the database call", async () => {
    getUpdateUserVerificationToVerifiedGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        success: false,
        error: "error",
      });
    });

    const { success, error } = await updateUserVerificationToVerified({
      getUpdateUserVerificationToVerifiedGateway,
      logger
    })({ hash });

    expect(success).toBeFalsy();
    expect(error).toEqual("error");
  });
});