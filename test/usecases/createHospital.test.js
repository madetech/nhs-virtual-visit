import createHospital from "../../src/usecases/createHospital";

describe("createHospital", () => {
  it("creates a hospital in the db when valid", async () => {
    const oneSpy = jest.fn().mockReturnValue({ id: 1 });
    const container = {
      async getDb() {
        return {
          one: oneSpy,
        };
      },
    };

    const request = {
      name: "Defoe Hospital",
      trustId: 2,
    };

    const { hospitalId, error } = await createHospital(container)(request);
    expect(hospitalId).toEqual(1);
    expect(error).toBeNull();
    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      "Defoe Hospital",
      2,
      null,
      null,
    ]);
  });

  it("creates a hospital with optional support url", async () => {
    const oneSpy = jest.fn().mockReturnValue({ id: 1 });
    const container = {
      async getDb() {
        return {
          one: oneSpy,
        };
      },
    };

    const request = {
      name: "Defoe Hospital",
      trustId: 2,
      supportUrl: "https://www.support.example.com",
      surveyUrl: "https://www.survey.example.com",
    };

    const { hospitalId, error } = await createHospital(container)(request);
    expect(hospitalId).toEqual(1);
    expect(error).toBeNull();
    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      "Defoe Hospital",
      2,
      "https://www.support.example.com",
      "https://www.survey.example.com",
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

    const { hospitalId, error } = await createHospital(container)("");
    expect(error).toEqual("Error: DB Error!");
    expect(hospitalId).toBeNull();
  });
});
