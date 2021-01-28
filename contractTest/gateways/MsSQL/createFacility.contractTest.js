import createFacility from "../../../src/gateways/MsSQL/createFacility";
import AppContainer from "../../../src/containers/AppContainer";

describe("createFacility()", () => {
  const container = AppContainer.getInstance();

  it("returns an id & timestamp", async () => {
    const { facility, error } = await createFacility(container)({
      name: "Foo",
      organisationId: 1,
      createdBy: 1,
      code: "foo",
      status: 0,
    });

    expect(error).toBeNull();
    expect(facility.id).toBeGreaterThan(0);
  });
});
