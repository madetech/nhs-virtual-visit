import updateLinkStatusByHashGateway from "../../../src/gateways/MsSQL/updateLinkStatusByHash";
import AppContainer from "../../../src/containers/AppContainer";
import {
  setupAdminAndOrganisation,
  setUpManager,
  setUpUserToVerify,
} from "../../../test/testUtils/factories";

describe("updateLinkStatusByHashGateway", () => {
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
    const verified = true;
    // Act
    const { userVerification, error } = await updateLinkStatusByHashGateway(
      container
    )({
      hash: verifyUser.hash,
      verified,
    });
    // Assert
    expect(error).toBeNull();
    expect(userVerification).toEqual({ ...verifyUser, verified });
  });
  it("returns an error if verified is not a boolean", async () => {
    // Arrange
    const { verifyUser } = await setUpUserToVerify(newUserToVerify);
    const verified = "yes";
    // Act
    const { userVerification, error } = await updateLinkStatusByHashGateway(
      container
    )({
      hash: verifyUser.hash,
      verified,
    });
    // Assert
    expect(error).toBeTruthy();
    expect(userVerification).toBeNull();
  });
  it("returns an error if hash is an empty string", async () => {
    // Arrange
    await setUpUserToVerify(newUserToVerify);
    const hash = "";
    const verified = true;
    // Act
    const { userVerification, error } = await updateLinkStatusByHashGateway(
      container
    )({
      hash,
      verified,
    });
    // Assert
    expect(error).toEqual(
      "Error updating verified field in user verification table"
    );
    expect(userVerification).toBeNull();
  });
});
