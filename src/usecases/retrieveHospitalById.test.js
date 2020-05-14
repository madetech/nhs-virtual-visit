import retrieveHospitalById from "./retrieveHospitalById";

describe("retrieveHospitalById", () => {
  it("returns a json object containing the call", async () => {
    const container = {
      async getDb() {
        return {
          oneOrNone: jest.fn().mockReturnValue({
            id: 1,
            name: "Test Hospital",
          }),
        };
      },
    };

    const hospitalId = 1;
    const trustId = 1;

    const { hospital, error } = await retrieveHospitalById(container)(
      hospitalId,
      trustId
    );

    expect(error).toBeNull();
    expect(hospital).toEqual({
      id: hospitalId,
      name: "Test Hospital",
    });
  });

  it("returns an error object on db exception", async () => {
    const container = {
      async getDb() {
        return {
          oneOrNone: jest.fn(() => {
            throw new Error("DB Error!");
          }),
        };
      },
    };

    const { error } = await retrieveHospitalById(container)(1);
    expect(error).toBeDefined();
    expect(error).toEqual("Error: DB Error!");
  });
});
