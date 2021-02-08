import retrieveManagersByOrgIdGateway from "../../../src/gateways/MsSQL/retrieveManagersByOrgId";
import {
  setUpManager,
  setupAdminAndOrganisation,
  setupOrganization,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";
import { statusToId, DISABLED } from "../../../src/helpers/statusTypes";

describe("retrieveManagersByOrgIdGateway", () => {
  const container = AppContainer.getInstance();
  it("retrieves a managers object when given a organisation id", async () => {
    // Arrange
    const { adminId, orgId: orgOneId } = await setupAdminAndOrganisation();
    const { orgId: orgTwoId } = await setupOrganization({ createdBy: adminId });
    const newManagerOne = {
      email: "managerOne@nhs.co.uk",
      organisationId: orgOneId,
    };
    const newManagerTwo = {
      email: "managerTwo@nhs.co.uk",
      organisationId: orgOneId,
    };
    const newManagerThree = {
      email: "managerThree@nhs.co.uk",
      organisationId: orgTwoId,
    };
    const { user: managerOne } = await setUpManager(newManagerOne);
    const { user: managerTwo } = await setUpManager(newManagerTwo);
    await setUpManager(newManagerThree);

    const expectedManagersArray = [
      {
        email: managerOne.email,
        id: managerOne.id,
        uuid: managerOne.uuid,
        status: statusToId(DISABLED),
      },
      {
        email: managerTwo.email,
        id: managerTwo.id,
        uuid: managerTwo.uuid,
        status: statusToId(DISABLED),
      },
    ];
    // Act
    const { managers, error } = await retrieveManagersByOrgIdGateway(container)(
      orgOneId
    );
    // Assert
    managers.forEach((manager, idx) => {
      expect(manager.email).toEqual(expectedManagersArray[idx].email);
      expect(manager.uuid).toEqual(expectedManagersArray[idx].uuid);
      expect(manager.status).toEqual(expectedManagersArray[idx].status);
      expect(manager.id).toEqual(expectedManagersArray[idx].id);
    });
    expect(error).toBeNull();
  });
  it("returns managers object to be an empty array if organisation id is undefined", async () => {
    // Act
    const { managers, error } = await retrieveManagersByOrgIdGateway(container)(
      undefined
    );
    // Assert
    expect(managers).toEqual([]);
    expect(error).toBeNull();
  });
});
