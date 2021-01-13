import createWard from "../../src/usecases/createWard";

describe("createWard", () => {
  let createWardSpy = jest.fn().mockReturnValue({ wardId: 10, error: null });
  let container;

  beforeEach(() => {
    container = {
      getCreateWardGateway: () => createWardSpy,
    };
  });

  it("creates a ward in the db when valid", async () => {
    const request = {
      name: "Defoe Ward",
      code: "WardCode",
      trustId: "1",
      pin: "1234",
      hospitalId: "1",
    };

    const { wardId, error } = await createWard(container)(request);

    expect(wardId).toEqual(10);
    expect(error).toBeNull();
  });
});
