import updateHospital from "../../src/usecases/updateHospital";

describe("updateHospital", () => {
  let updateHospitalSpy = jest
    .fn()
    .mockReturnValue({ hospitalId: 10, error: null });
  let container;

  beforeEach(() => {
    container = {
      getUpdateHospitalGateway: () => updateHospitalSpy,
    };
  });

  it("calls updateHospital when valid", async () => {
    const request = {
      id: 10,
      name: "Hospital",
      status: "active",
    };

    const { id, error } = await updateHospital(container)(request);

    expect(id).toEqual(10);
    expect(error).toBeNull();
    expect(updateHospitalSpy).toHaveBeenCalledWith({
      name: request.name,
      id: request.id,
      supportUrl: null,
      surveyUrl: null,
      status: "active",
    });
  });

  it("updates a hospital with an optional support url", async () => {
    const request = {
      id: 10,
      name: "Hospital",
      status: "active",
      supportUrl: "https://www.support.example.com",
      surveyUrl: "https://www.survey.example.com",
    };

    const { id, error } = await updateHospital(container)(request);

    expect(id).toEqual(10);
    expect(error).toBeNull();
    expect(updateHospitalSpy).toHaveBeenCalledWith({
      name: request.name,
      id: request.id,
      supportUrl: "https://www.support.example.com",
      surveyUrl: "https://www.survey.example.com",
      status: "active",
    });
  });

  it("returns error response when updateHospital returns error", async () => {
    container.getUpdateHospitalGateway = () =>
      jest
        .fn()
        .mockReturnValue({ hospitalId: null, error: "Error: DB Error!" });

    const { id, error } = await updateHospital(container)("rubbishRequest");

    expect(error).toEqual("Error: DB Error!");
    expect(id).toEqual(null);
  });
});
