import retrieveHospitalById from "../../src/usecases/retrieveHospitalById";

import logger from "../../logger";
describe("retrieveHospitalById", () => {
  let retrieveHospitalSpy = jest.fn().mockReturnValue({
    hospital: {
      id: 1,
      name: "Test Hospital",
      supportUrl: "https://www.support.example.com",
      surveyUrl: "https://www.survey.example.com",
    },
    error: null,
  });
  let container;

  beforeEach(() => {
    container = {
      getRetrieveHospitalByIdGateway: () => retrieveHospitalSpy,
      logger
    };
  });

  it("returns a json object containing the call", async () => {
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
    container.getRetrieveHospitalByIdGateway = () =>
      jest.fn().mockReturnValue({ hospital: null, error: "Error: DB Error!" });

    const { error } = await retrieveHospitalById(container)(1);
    expect(error).toBeDefined();
    expect(error).toEqual("Error: DB Error!");
  });
});
