import retrieveManagerByEmailGateway from "../../../src/gateways/MsSQL/retrieveManagerByEmail";
import {
  setUpManager,
  setupOrganization,
  setUpAdmin,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveManagerByEmailGateway", () => {
  const container = AppContainer.getInstance();
  it("retrieves a manager object when given a manager uuid", async () => {
    // Arrange
    const {
      user: { id: adminId },
    } = await setUpAdmin();
    const { orgId } = await setupOrganization({ createdBy: adminId });
    const newManager = {
      email: "test@nhs.co.uk",
      password: "hashed password",
      organisationId: orgId,
      type: "manager",
    };
    const { user: expectedManager } = await setUpManager(newManager);

    // Act
    const { manager, error } = await retrieveManagerByEmailGateway(container)(
      expectedManager.email
    );
    // Assert
    expect(manager.email).toEqual(expectedManager.email);
    expect(manager.uuid).toEqual(expectedManager.uuid);
    expect(manager.id).toEqual(expectedManager.id);
    expect(manager.type).toEqual(expectedManager.type);
    expect(error).toBeNull();
  });
  it("returns an error if email is undefined", async () => {
    // Act
    const { manager, error } = await retrieveManagerByEmailGateway(container)(
      undefined
    );
    // Assert
    expect(manager).toBeNull();
    expect(error).toEqual("Error: Manager is undefined");
  });
});
