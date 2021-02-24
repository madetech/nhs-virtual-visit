import verifyTimeSensitiveLinkGateway from "../../../src/gateways/MsSQL/verifyTimeSensitiveLink";
import AppContainer from "../../../src/containers/AppContainer";
import {
  setupAdminAndOrganisation,
  setUpManager,
  setUpUserToVerify,
} from "../../../test/testUtils/factories";

describe("verifySignUpLinkGateway", () => {
  const container = AppContainer.getInstance();
  let manager, orgId, newUserToVerify;
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
  });
  it("add manager for reset password or self sign up", async () => {
    // Arrange
    const { verifyUser } = await setUpUserToVerify(newUserToVerify);
    const expectedVerifySignUpUser = {
      organisation_id: orgId,
      user_id: verifyUser.user_id,
      verified: verifyUser.verified,
      hash: verifyUser.hash,
      type: verifyUser.type,
      status: manager.status,
      email: manager.email,
    };
    // Act
    const { user, error } = await verifyTimeSensitiveLinkGateway(container)({
      hash: verifyUser.hash,
      uuid: manager.uuid,
    });
    // Assert
    expect(error).toBeNull();
    expect(user).toEqual(expectedVerifySignUpUser);
  });
  it("returns an error if uuid is not of type unique identifier", async () => {
    // Arrange
    const { verifyUser } = await setUpUserToVerify(newUserToVerify);
    // Act
    const { user, error } = await verifyTimeSensitiveLinkGateway(container)({
      hash: verifyUser.hash,
      uuid: "uuid does not exist",
    });
    // Assert
    expect(error).toBeTruthy();
    expect(user).toBeNull();
  });
  it("returns an error if uuid is undefined", async () => {
    // Arrange
    const { verifyUser } = await setUpUserToVerify(newUserToVerify);
    // Act
    const { user, error } = await verifyTimeSensitiveLinkGateway(container)({
      hash: verifyUser.hash,
      uuid: undefined,
    });
    // Assert

    expect(user).toBeNull();
    expect(error).toBeTruthy();
  });
  it("returns an error if uuid is not of type unique identifier", async () => {
    // Arrange
    const { verifyUser } = await setUpUserToVerify(newUserToVerify);
    // Act
    const { user, error } = await verifyTimeSensitiveLinkGateway(container)({
      hash: verifyUser.hash,
      uuid: "uuid does not exist",
    });
    // Assert
    expect(error).toBeTruthy();
    expect(user).toBeNull();
  });
});
