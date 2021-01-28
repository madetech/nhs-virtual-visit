import updateLinkStatusByHash from "../../src/usecases/updateLinkStatusByHash";

describe("updateLinkStatusByHash", () => {
  let hash;
  let getUpdateLinkStatusByHashGateway;

  beforeEach(() => {
    hash = "hash";
    getUpdateLinkStatusByHashGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        userVerification: "verfiedUser",
        error: null,
      });
    });
  });

  it("returns an error if there is no hash", async () => {
    hash = "";
    const { userVerification, error } = await updateLinkStatusByHash({
      getUpdateLinkStatusByHashGateway,
    })({ hash });

    expect(userVerification).toBeNull();
    expect(error).toEqual("hash is not defined");
  });

  it("updates the user verification table and returns verified user", async () => {
    const getUpdateLinkStatusByHashGatewaySpy = jest.fn().mockReturnValue({
      userVerification: "verifiedUser",
      error: null,
    });

    getUpdateLinkStatusByHashGateway = jest.fn(() => {
      return getUpdateLinkStatusByHashGatewaySpy;
    });

    const { userVerification, error } = await updateLinkStatusByHash({
      getUpdateLinkStatusByHashGateway,
    })({ hash });

    const expectedResponse = "verifiedUser";

    expect(userVerification).toEqual(expectedResponse);
    expect(error).toBeNull();
    expect(getUpdateLinkStatusByHashGatewaySpy).toHaveBeenCalledWith({
      hash: "hash",
      verified: true,
    });
  });

  it("returns an error if there is problem with the database call", async () => {
    getUpdateLinkStatusByHashGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        userVerification: null,
        error: "error",
      });
    });

    const { userVerification, error } = await updateLinkStatusByHash({
      getUpdateLinkStatusByHashGateway,
    })({ hash });

    expect(userVerification).toBeNull();
    expect(error).toEqual("error");
  });
});
