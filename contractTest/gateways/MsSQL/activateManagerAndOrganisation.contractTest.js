import activateManagerAndOrganisationGateway from "../../../src/gateways/MsSQL/activateManagerAndOrganisation";
import AppContainer from "../../../src/containers/AppContainer";
import {
  setupAdminAndOrganisation,
  setUpManager,
  setUpUserToVerify,
} from "../../../test/testUtils/factories";
import { statusToId, ACTIVE } from "../../../src/helpers/statusTypes";

describe("activateManagerAndOrganisationGateway", () => {
  const container = AppContainer.getInstance();
  const verified = true;
  let orgId, manager, newUserToVerify;
  beforeEach(async () => {
    let result = await setupAdminAndOrganisation();
    orgId = result.orgId;
    result = await setUpManager({ organisationId: orgId });
    manager = result.user;
    newUserToVerify = {
      user_id: manager.id,
      code: "uuidv4",
      hash: "hash",
      type: "confirmRegistration",
    };
    await setUpUserToVerify(newUserToVerify);
  });
  it("activates a manager and organisation status", async () => {
    // Arrange
    const statusToUpdate = statusToId(ACTIVE);
    // Act
    const { organisation, error } = await activateManagerAndOrganisationGateway(
      container
    )({
      organisationId: orgId,
      userId: manager.id,
      verified,
      status: statusToUpdate,
    });
    // Assert
    expect(error).toBeNull();
    expect(organisation.status).toEqual(statusToUpdate);
    expect(organisation.id).toEqual(orgId);
  });
  it("returns error if the organisation id isn't found in the database", async () => {
    // Arrange
    const statusToUpdate = statusToId(ACTIVE);
    const invalidOrgId = 1000000;
    // Act
    const { organisation, error } = await activateManagerAndOrganisationGateway(
      container
    )({
      organisationId: invalidOrgId,
      userId: manager.id,
      verified,
      status: statusToUpdate,
    });
    // Assert
    expect(organisation).toBeNull();
    expect(error).toEqual("Error activating organisation and manager");
  });
  it("returns error if the manager id isn't found in the database", async () => {
    // Arrange
    const statusToUpdate = statusToId(ACTIVE);
    const invalidManagerId = undefined;
    // Act
    const { organisation, error } = await activateManagerAndOrganisationGateway(
      container
    )({
      organisationId: orgId,
      userId: invalidManagerId,
      verified,
      status: statusToUpdate,
    });
    // Assert
    expect(organisation).toBeNull();
    expect(error).toEqual("Error activating organisation and manager");
  });
  it("returns error if the status is not a number", async () => {
    // Arrange
    const statusToUpdate = "active";
    // Act
    const { organisation, error } = await activateManagerAndOrganisationGateway(
      container
    )({
      organisationId: orgId,
      userId: manager.id,
      verified,
      status: statusToUpdate,
    });
    // Assert
    expect(organisation).toBeNull();
    expect(error).toEqual("Error activating organisation and manager");
  });
});
