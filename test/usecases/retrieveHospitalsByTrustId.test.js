import retreiveHospitalsByTrustId from "../../src/usecases/retrieveHospitalsByTrustId";

describe("retreiveHospitalsByTrustId", () => {
  let retrieveHospitalsSpy = jest.fn().mockReturnValue({
    hospitals: [
      {
        id: 1,
        name: "hospitalNameOne",
      },
      {
        id: 2,
        name: "hospitalNameTwo",
      },
    ],
    error: null,
  });
  let container;

  beforeEach(() => {
    container = {
      getRetrieveHospitalsByTrustIdGateway: () => retrieveHospitalsSpy,
    };
  });

  it("returns a json object containing the call", async () => {
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
  });

  it("returns an error object on db exception", async () => {
    container.getRetrieveHospitalByIdGateway = () =>
      jest.fn().mockReturnValue({ hospitals: null, error: "Error: DB Error!" });

    const { error } = await retreiveHospitalsByTrustId(container)(1);
    expect(error).toBeDefined();
  });
});
