import insertHospital from "../../src/gateways/insertHospital";

describe("insertHospital", () => {
  let oneSpy = jest.fn().mockReturnValue({ id: 1 });
  let container;

  beforeEach(() => {
    container = {
      getDb() {
        return {
          one: oneSpy,
        };
      },
    };
  });

  it("creates a hospital in the db when valid", async () => {
    const request = {
      name: "Defoe Hospital",
      trustId: 2,
      code: "DFH",
    };

    const { hospitalId, error } = await insertHospital(container)(request);

    expect(hospitalId).toEqual(1);
    expect(error).toBeNull();
    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      "Defoe Hospital",
      2,
      null,
      null,
      "DFH",
    ]);
  });

  it("creates a hospital with optional support url", async () => {
    const request = {
      name: "Defoe Hospital",
      trustId: 2,
      code: "DFH",
      supportUrl: "https://www.support.example.com",
      surveyUrl: "https://www.survey.example.com",
    };

    const { hospitalId, error } = await insertHospital(container)(request);

    expect(hospitalId).toEqual(1);
    expect(error).toBeNull();
    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      "Defoe Hospital",
      2,
      "https://www.support.example.com",
      "https://www.survey.example.com",
      "DFH",
    ]);
  });

  it("returns an error object on db exception", async () => {
    oneSpy = jest.fn(() => {
      throw new Error("DB Error!");
    });

    const { hospitalId, error } = await insertHospital(container)("");

    expect(error).toEqual("Error: DB Error!");
    expect(hospitalId).toBeNull();
  });
});
