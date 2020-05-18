import retrieveWards from "./retrieveWards";

describe("retrieveWards", () => {
  it("returns a json object containing the wards", async () => {
    const anySpy = jest.fn(() => [
      {
        ward_id: 1,
        ward_name: "Defoe Ward",
        hospital_name: "Test Hospital",
        ward_code: "test_code",
      },
      {
        ward_id: 2,
        ward_name: "Willem Ward",
        hospital_name: "Test Hospital 2",
        ward_code: "test_code_2",
      },
      {
        id: 3,
        name: "Archived Ward",
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
    expect(anySpy).toHaveBeenCalledWith(expect.anything(), [trustId]);
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
