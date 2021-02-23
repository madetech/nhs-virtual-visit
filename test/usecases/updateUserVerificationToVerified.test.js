import updateUserVerificationToVerified from "../../src/usecases/updateUserVerificationToVerified";

describe("updateUserVerificationToVerified", () => {

  let userId;
  let getUpdateUserVerificationToVerifiedGateway;
  
  beforeEach(() => {
    userId = 1;
    getUpdateUserVerificationToVerifiedGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        success: true,
        error: null,
      });
    });
  });

  it("returns an error if userId is not defined", async () => {
    userId = "";

    const { success, error } = await updateUserVerificationToVerified({
      getUpdateUserVerificationToVerifiedGateway,
    })({ userId });

    expect(success).toBeFalsy();
    expect(error).toEqual("userId is not defined");
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
    })({ userId });

    expect(success).toBeTruthy();
    expect(error).toBeNull();
    expect(getUpdateUserVerificationToVerifiedGatewaySpy).toHaveBeenCalledWith({
      userId: 1,
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
    })({ userId });

    expect(success).toBeFalsy();
    expect(error).toEqual("error");
  });
});