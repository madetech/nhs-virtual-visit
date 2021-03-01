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
      code: "uuidv4",
      hash: "hash",
      type: "resetPassword",      
    };
  })

  it("updates a user verification row to verified", async () => {
    // Arrange
    const { verifyUser } = await setUpUserToVerify(newUserToVerify);
    const verified = true;

    // Act
    const updateUserVerificationToVerified = updateUserVerificationToVerifiedGateway(container);
    const { success, error } = await updateUserVerificationToVerified({ 
      hash: verifyUser.hash, 
      verified,
    });

    // Assert
    expect(error).toBeNull();
    expect(success).toBeTruthy();
  });

    it("returns an error if verified is not a boolean", async () => {
      // Arrange
      const { verifyUser } = await setUpUserToVerify(newUserToVerify);
      const verified = "yes";

      // Act
      const updateUserVerificationToVerified = updateUserVerificationToVerifiedGateway(container);
      const { success, error } = await updateUserVerificationToVerified({ 
        hash: verifyUser.hash, 
        verified,
      });

      // Assert
      expect(error).toBeTruthy();
      expect(success).toBeFalsy();
    });

  it("returns an error if hash is not in the database", async () => {
    // Arrange
    await setUpUserToVerify(newUserToVerify);
    const verified = true;
    const hash = "";

    // Act
    const updateUserVerificationToVerified = updateUserVerificationToVerifiedGateway(container);
    const { success, error } = await updateUserVerificationToVerified({ hash, verified });

    // Assert
    expect(success).toBeFalsy();
    expect(error).toEqual("The hash could not be found in the user_verification table");
  });
});
