import updateTrust from "../../../src/gateways/PostgreSQL/updateTrust";

describe("updateTrust", () => {
  it("updates a trust in the db when valid", async () => {
    const oneSpy = jest.fn().mockReturnValue({ id: 10 });
    const container = {
      getDb() {
        return {
          oneOrNone: oneSpy,
        };
      },
    };
    const request = {
      id: 10,
      videoProvider: "whereby",
    };
    const { id, error } = await updateTrust(container)(request);
    expect(id).toEqual(10);
    expect(error).toBeNull();
    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      request.videoProvider,
      request.id,
    ]);
  });

  it("returns an error if the database query errors", async () => {
    const container = {
      getDb() {
        return {
          oneOrNone: jest.fn(() => {
            throw new Error("fail");
          }),
        };
      },
    };

    const { error, id } = await updateTrust(container)({
      id: 123,
      videoProvider: "whereby",
    });
    expect(error).toEqual("Error: fail");
    expect(id).toBeNull();
  });
});
