import retrieveHospitalById from "../../../src/gateways/PostgreSQL/retrieveHospitalById";

describe("retrieveHospitalById", () => {
  it("returns a json object containing the call", async () => {
    const container = {
      getDb() {
        return {
          oneOrNone: jest.fn().mockReturnValue({
            id: 1,
            name: "Test Hospital",
            support_url: "https://www.support.example.com",
            survey_url: "https://www.survey.example.com",
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
      supportUrl: "https://www.support.example.com",
      surveyUrl: "https://www.survey.example.com",
    });
  });

  it("returns an error object on db exception", async () => {
    const container = {
      getDb() {
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
