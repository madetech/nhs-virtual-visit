import retrieveWards from "../../src/usecases/retrieveWards";

describe("retrieveWards", () => {
  it("returns a json object containing the wards", async () => {
    const retrieveActiveWardsByTrustIdSpy = jest.fn(async () => [
      {
        wardId: 1,
        wardName: "Defoe Ward",
        wardCode: "test_code",
        hospitalName: "Test Hospital",
      },
      {
        wardId: 2,
        wardName: "Willem Ward",
        wardCode: "test_code_2",
        hospitalName: "Test Hospital 2",
      },
    ]);

    const container = {
      getRetrieveActiveWardsByTrustIdGW: () => retrieveActiveWardsByTrustIdSpy,
    };

    const trustId = 3;

    const { wards, error } = await retrieveWards(container)(trustId);

    expect(error).toBeNull();
    expect(retrieveActiveWardsByTrustIdSpy).toHaveBeenCalledWith(trustId);
    expect(wards).toHaveLength(2);
    expect(wards[0]).toEqual({
      id: 1,
      name: "Defoe Ward",
      hospitalName: "Test Hospital",
      code: "test_code",
    });
    expect(wards[1]).toEqual({
      id: 2,
      name: "Willem Ward",
      hospitalName: "Test Hospital 2",
      code: "test_code_2",
    });
  });

  it("returns an error object on db exception", async () => {
    const container = {
      getDb: () => () => {},
      getRetrieveActiveWardsByTrustIdGW: () => async () => {
        throw new Error("Dummy");
      },
    };

    const { error } = await retrieveWards(container)();
    expect(error).toEqual("Error: Dummy");
  });
});
