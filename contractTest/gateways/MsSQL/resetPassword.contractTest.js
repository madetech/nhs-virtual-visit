import resetPasswordGateway from "../../../src/gateways/MsSQL/resetPassword";
import AppContainer from "../../../src/containers/AppContainer";
import {
  setupAdminAndOrganisation,
  setUpManager,
} from "../../../test/testUtils/factories";

describe("resetPasswordGateway", () => {
  const container = AppContainer.getInstance();
  const newPassword = "new password";
  let manager, orgId, newManager;
  beforeEach(async () => {
    let result = await setupAdminAndOrganisation();
    orgId = result.orgId;
    newManager = {
      email: "manager@nhs.co.uk",
      password: "hashed password",
    };
    result = await setUpManager({ ...newManager, organisationId: orgId });
    manager = result.user;
  });
  it("returns resetSuccess is true if given email is valid", async () => {
    // Act
    const { resetSuccess, error } = await resetPasswordGateway(container)({
      password: newPassword,
      email: manager.email,
    });
    // Assert
    expect(error).toBeNull();
    expect(resetSuccess).toEqual(true);
  });
  it("returns an error if email does not exist", async () => {
    // Act
    const invalidEmail = "invalid-email@nhs.co.uk";
    const { resetSuccess, error } = await resetPasswordGateway(container)({
      password: newPassword,
      email: invalidEmail,
    });
    // Assert
    expect(error).toEqual(`Error resetting password for email ${invalidEmail}`);
    expect(resetSuccess).toEqual(false);
  });
  it("returns an error if email is undefined", async () => {
    // Act
    const { resetSuccess, error } = await resetPasswordGateway(container)({
      password: newPassword,
      email: undefined,
    });
    // Assert
    expect(error).toEqual(`Error resetting password for email ${undefined}`);
    expect(resetSuccess).toEqual(false);
  });
});
