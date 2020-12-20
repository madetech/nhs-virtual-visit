import updateHospital from "../../src/usecases/updateHospital";

describe("updateHospital", () => {
  it("updates a hospital in the db when valid", async () => {
    const oneSpy = jest.fn().mockReturnValue({ id: 10 });
    const container = {
      async getDb() {
        return {
          one: oneSpy,
        };
      },
    };
    const request = {
      id: 10,
      name: "Hospital",
      status: "active",
    };
    const { id, error } = await updateHospital(container)(request);
    expect(id).toEqual(10);
    expect(error).toBeNull();
    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      request.name,
      request.id,
      null,
      null,
      "active",
    ]);
  });

  it("updates a hospital with an optional support url", async () => {
    const oneSpy = jest.fn().mockReturnValue({ id: 10 });
    const container = {
      async getDb() {
        return {
          one: oneSpy,
        };
      },
    };
    const request = {
      id: 10,
      name: "Hospital",
      code: "HHH",
      status: "active",
      supportUrl: "https://www.support.example.com",
      surveyUrl: "https://www.survey.example.com",
    };
    const { id, error } = await updateHospital(container)(request);
    expect(id).toEqual(10);
    expect(error).toBeNull();
    expect(oneSpy).toHaveBeenCalledWith(expect.anything(), [
      request.name,
      request.id,
      "https://www.support.example.com",
      "https://www.survey.example.com",
      "active",
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
    const { id, error } = await updateHospital(container)("rubbishRequest");
    expect(error).toEqual("Error: DB Error!");
    expect(id).toEqual(null);
  });
});
