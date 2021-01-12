import retreiveHospitalsByTrustId from "../../../src/gateways/PostgreSQL/retrieveHospitalsByTrustId";

describe("retreiveHospitalsByTrustId", () => {
  it("returns a json object containing the call", async () => {
    const anySpy = jest.fn().mockReturnValue([
      {
        id: 1,
        name: "hospitalNameOne",
        trust_id: 1,
      },
      { id: 2, name: "hospitalNameTwo", trust_id: 1 },
    ]);

    const container = {
      getDb() {
        return {
          any: anySpy,
        };
      },
    };

    const { hospitals, error } = await retreiveHospitalsByTrustId(container)(1);
    expect(error).toBeNull();
    expect(hospitals).toEqual([
      {
        id: 1,
        name: "hospitalNameOne",
      },
      {
        id: 2,
        name: "hospitalNameTwo",
      },
    ]);
    expect(anySpy).toHaveBeenCalledWith(expect.anything(), 1);
  });

  it("returns an error object on db exception", async () => {
    const container = {
      getDb() {
        return {
          any: jest.fn(() => {
            throw new Error("DB Error!");
          }),
        };
      },
    };
    const { error } = await retreiveHospitalsByTrustId(container)(1);
    expect(error).toBeDefined();
  });
});
