import updateUserVerificationToVerifiedGateway from "../../../src/gateways/MsSQL/updateUserVerificationToVerified";
import AppContainer from "../../../src/containers/AppContainer";
import { setUpUserToVerify, setUpAdmin } from "../../../test/testUtils/factories";

describe("updateUserVerificationToVerified", () => {
  const container = AppContainer.getInstance();
  
  let newUserToVerify;
  let admin;
  beforeEach(async () => {
    const result = await setUpAdmin();
    admin = result.user;
    newUserToVerify = {
      user_id: admin.id,
      type: "resetPassword",      
    };
    await setUpUserToVerify(newUserToVerify);
  })

  it("updates a user verification row to verified", async () => {
    // Arrange
    const verified = true;
    const userId = admin.id;

    // Act
    const updateUserVerificationToVerified = updateUserVerificationToVerifiedGateway(container);
    const { success, error } = await updateUserVerificationToVerified({ userId, verified });

    // Assert
    expect(error).toBeNull();
    expect(success).toBeTruthy();
  });

  it("returns an error if userId is not in the database", async () => {
    // Arrange
    const verified = true;
    const userId = 100000;

    // Act
    const updateUserVerificationToVerified = updateUserVerificationToVerifiedGateway(container);
    const { success, error } = await updateUserVerificationToVerified({ userId, verified });

    // Assert
    expect(success).toBeFalsy();
    expect(error).toBeTruthy();
  });
});
