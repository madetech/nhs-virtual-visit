import updateManagerStatusByUuidGateway from "../../../src/gateways/MsSQL/updateManagerStatusByUuid";
import { statusToId, ACTIVE } from "../../../src/helpers/statusTypes";
import {
  setUpManager,
  setupOrganization,
  setUpAdmin,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("updateManagerStatusByUuidGateway", () => {
  const container = AppContainer.getInstance();
  it("updates a manager status", async () => {
    // Arrange
    const {
      user: { id: adminId },
    } = await setUpAdmin();
    const { orgId } = await setupOrganization({ createdBy: adminId });
    const { user } = await setUpManager({ organisationId: orgId });
    // Act
    const uuid = await updateManagerStatusByUuidGateway(container)(
      user.uuid,
      statusToId(ACTIVE)
    );
    const manager = await container.getRetrieveManagerByUuidGateway()(uuid);
    // Assert
    expect(manager.status).toEqual(statusToId(ACTIVE));
  });
  it("throws an error if uuid is undefined", async () => {
    // Arrange
    const undefinedUuid = undefined;
    // Act
    expect(
      async () =>
        await updateManagerStatusByUuidGateway(container)(
          undefinedUuid,
          statusToId(ACTIVE)
        )
    ).rejects.toThrowError();
  });
});
