import retrieveActiveManagersByOrgIdGateway from "../../../src/gateways/MsSQL/retrieveActiveManagersByOrgId";
import {
  setupAdminAndOrganisation,
  setUpManager,
} from "../../../test/testUtils/factories";
import { statusToId, ACTIVE } from "../../../src/helpers/statusTypes";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveActiveManagersByOrgIdGateway", () => {
  const container = AppContainer.getInstance();
  it("retrieves managers with status as ACTIVE", async () => {
    // Arrange
    const { orgId } = await setupAdminAndOrganisation();
    const managerOneEmail = "managerOne@nhs.co.uk";
    const managerTwoEmail = "managerTwo@nhs.co.uk";
    const managerThreeEmail = "managerThree@nhs.co.uk";

    const {
      user: { uuid: managerOneUuid },
    } = await setUpManager({ organisationId: orgId, email: managerOneEmail });
    await setUpManager({ organisationId: orgId, email: managerTwoEmail });
    await setUpManager({ organisationId: orgId, email: managerThreeEmail });

    await container.getUpdateManagerStatusByUuidGateway()(
      managerOneUuid,
      statusToId(ACTIVE)
    );
    const {
      managers: allManagers,
    } = await container.getRetrieveManagersByOrgIdGateway()(orgId);
    // Act
    const {
      managers: activeManagers,
      error,
    } = await retrieveActiveManagersByOrgIdGateway(container)(orgId);
    // Assert
    expect(activeManagers).toEqual(
      allManagers.filter((manager) => manager.status == statusToId(ACTIVE))
    );
    expect(error).toBeNull();
  });
});
