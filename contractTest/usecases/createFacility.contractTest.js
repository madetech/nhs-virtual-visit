import {
  setupOrganization,
  setUpManager,
} from "../../test/testUtils/factories";
import AppContainer from "../../src/containers/AppContainer";

describe("createFacility", () => {
  const container = AppContainer.getInstance();
  it("creates a valid facility", async () => {
    // Arrange
    const {
      organisation: { id: orgId },
    } = await setupOrganization();
    const email = `${Math.random()}@nhs.co.uk`;
    const {
      user: { id: userId },
    } = await setUpManager({ organisationId: orgId, email });
    const facilityArgs = {
      name: "Test Facility One",
      code: "TF1",
    };
    const { uuid: facilityUuid, error } = await container.getCreateFacility()({
      ...facilityArgs,
      orgId: orgId,
      createdBy: userId,
    });
    const { facility } = await container.getRetrieveFacilityByUuid()(
      facilityUuid
    );
    expect(facility).toEqual({
      ...facilityArgs,
      status: "active",
      id: facility.id,
      uuid: facility.uuid,
    });
    expect(error).toBeNull();
  });
});
