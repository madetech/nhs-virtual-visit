import createHospital from "../../src/usecases/createHospital";

describe("createHospital", () => {
  let insertHospitalSpy = jest
    .fn()
    .mockReturnValue({ hospitalId: 1, error: null });
  let container;

  beforeEach(() => {
    container = {
      getInsertHospitalGateway: () => insertHospitalSpy,
    };
  });

  it("calls insert hospital when valid", async () => {
    const request = {
      name: "Defoe Hospital",
      trustId: 2,
      code: "DFH",
    };

    const { hospitalId, error } = await createHospital(container)(request);

    expect(hospitalId).toEqual(1);
    expect(error).toBeNull();
    expect(insertHospitalSpy).toHaveBeenCalledWith({
      name: "Defoe Hospital",
      trustId: 2,
      code: "DFH",
      supportUrl: null,
      surveyUrl: null,
    });
  });

  it("calls insert hospital with optional arguments", async () => {
    const request = {
      name: "Defoe Hospital",
      trustId: 2,
      code: "DFH",
      supportUrl: "https://www.support.example.com",
      surveyUrl: "https://www.survey.example.com",
    };

    const { hospitalId, error } = await createHospital(container)(request);

    expect(hospitalId).toEqual(1);
    expect(error).toBeNull();
    expect(insertHospitalSpy).toHaveBeenCalledWith({
      name: "Defoe Hospital",
      trustId: 2,
      code: "DFH",
      supportUrl: "https://www.support.example.com",
      surveyUrl: "https://www.survey.example.com",
    });
  });

  it("returns error response when insertHospital returns error", async () => {
    container.getInsertHospitalGateway = () =>
      jest.fn().mockReturnValue({ hospitalId: null, error: "Oh no" });

    const { hospitalId, error } = await createHospital(container)("");

    expect(error).toEqual("Oh no");
    expect(hospitalId).toBeNull();
  });
});
