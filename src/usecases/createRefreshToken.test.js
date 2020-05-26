import createRefreshToken from "./createRefreshToken";

describe("createRefreshToken", () => {
  it("creates a refreshToken in the db when valid", async () => {
    const oneSpy = jest.fn().mockReturnValue({ id: 1 });
    const container = {
      async getDb() {
        return {
          one: oneSpy,
        };
      },
    };

    const request = {
      refreshToken: "secureTokenString",
    };

    const { refreshTokenId, error } = await createRefreshToken(container)(
      request
    );
    expect(refreshTokenId).toEqual(1);
    expect(error).toBeNull();
    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      request.refreshToken,
    ]);
  });

  it("returns an error object on db exception", async () => {
    const container = {
      async getDb() {
        return {
          one: jest.fn(() => {
            throw new Error("DB Error!");
          }),
        };
      },
    };

    const { refreshTokenId, error } = await createRefreshToken(container)("");
    expect(error).toEqual("Error: DB Error!");
    expect(refreshTokenId).toBeNull();
  });
});
