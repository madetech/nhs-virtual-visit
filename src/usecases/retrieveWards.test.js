import retrieveWards from "./retrieveWards";

describe("retrieveWards", () => {
  it("returns a json object containing the wards", async () => {
    const anySpy = jest.fn(() => [
      {
        id: 1,
        name: "Defoe Ward",
        hospital_name: "Test Hospital",
        code: "test_code",
      },
      {
        id: 2,
        name: "Willem Ward",
        hospital_name: "Test Hospital 2",
        code: "test_code_2",
      },
    ]);

    const container = {
      async getDb() {
        return {
          any: anySpy,
        };
      },
    };

    const trustId = 3;

    const { wards, error } = await retrieveWards(container)(trustId);

    expect(error).toBeNull();
    expect(
      anySpy
    ).toHaveBeenCalledWith(
      "SELECT * FROM wards WHERE trust_id = $1 ORDER BY hospital_name ASC, name ASC",
      [trustId]
    );
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
      async getDb() {
        return {
          any: jest.fn(() => {
            throw new Error("DB Error!");
          }),
        };
      },
    };

    const { error } = await retrieveWards(container)();
    expect(error).toBeDefined();
  });
});
