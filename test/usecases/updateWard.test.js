import updateWard from "../../src/usecases/updateWard";

describe("updateWard", () => {
  let updateWardSpy = jest.fn().mockReturnValue({ wardId: 10, error: null });

  let container;

  beforeEach(() => {
    container = {
      getUpdateWardGateway: () => updateWardSpy,
    };
  });

  const request = {
    ward: {
      id: 10,
      status: "active",
      name: "Defoe Ward",
      hospitalId: 1,
    },
  };

  it("updates a ward in the db when valid", async () => {
    const { wardId, error } = await updateWard(container)(request);

    expect(wardId).toEqual(10);
    expect(error).toBeNull();
  });

  it("returns an error object on db exception", async () => {
    container.getUpdateWardGateway = () =>
      jest.fn().mockReturnValue({ wardId: null, error: "Error: DB Error!" });

    const { wardId, error } = await updateWard(container)(request);

    expect(error).toEqual("Error: DB Error!");
    expect(wardId).toEqual(null);
  });
});
