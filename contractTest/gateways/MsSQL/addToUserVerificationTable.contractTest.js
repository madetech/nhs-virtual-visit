import addToUserVerificationTableGateway from "../../../src/gateways/MsSQL/addToUserVerificationTable";
import AppContainer from "../../../src/containers/AppContainer";
import {
  setupAdminAndOrganisation,
  setUpManager,
} from "../../../test/testUtils/factories";

describe("addToUserVerificationTableGateway", () => {
  const container = AppContainer.getInstance();
  it("add manager for reset password or self sign up", async () => {
    // Arrange
    const { orgId } = await setupAdminAndOrganisation();
    const { user: manager } = await setUpManager({ organisationId: orgId });
    const newUserToVerify = {
      user_id: manager.id,
      code: "uuidv4",
      hash: "hash",
      type: "confirmRegistration",
    };
    // Act
    const { verifyUser, error } = await addToUserVerificationTableGateway(
      container
    )(newUserToVerify);
    const { user } = await container.getVerifyTimeSensitiveLinkGateway()({
      hash: newUserToVerify.hash,
      uuid: manager.uuid,
    });
    // Assert
    expect(error).toBeNull();
    expect(verifyUser.user_id).toEqual(user.user_id);
    expect(verifyUser.hash).toEqual(user.hash);
    expect(verifyUser.type).toEqual(user.type);
  });
  it("returns an error if user_id does not exist", async () => {
    // Arrange
    const newUserToVerify = {
      user_id: 111111111,
      code: "uuidv4",
      hash: "hash",
      type: "confirmRegistration",
    };
    // Act
    const { verifyUser, error } = await addToUserVerificationTableGateway(
      container
    )(newUserToVerify);
    // Assert
    expect(error).toBeTruthy();
    expect(verifyUser).toBeNull();
  });
});
