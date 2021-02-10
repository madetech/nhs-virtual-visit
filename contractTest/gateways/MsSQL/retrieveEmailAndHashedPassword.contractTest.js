import retrieveEmailAndHashedPasswordGateway from "../../../src/gateways/MsSQL/retrieveEmailAndHashedPassword";
import AppContainer from "../../../src/containers/AppContainer";
import bcrypt from "bcryptjs";
import {
  setupAdminAndOrganisation,
  setUpManager,
} from "../../../test/testUtils/factories";

describe("retrieveEmailAndHashedPasswordGateway", () => {
  const container = AppContainer.getInstance();
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
  it("retrieves user object if given email is valid", async () => {
    // Act
    const { user, error } = await retrieveEmailAndHashedPasswordGateway(
      container
    )({
      email: manager.email,
    });
    // Assert
    expect(error).toBeNull();
    expect(user.emailAddress).toEqual(newManager.email);
    expect(
      bcrypt.compareSync(newManager.password, user.hashedPassword)
    ).toEqual(true);
  });
  it("returns an error if email does not exist", async () => {
    // Act
    const { user, error } = await retrieveEmailAndHashedPasswordGateway(
      container
    )({
      email: "invalid-email@nhs.co.uk",
    });
    // Assert
    expect(error).toEqual("Error retrieving hashedPassword");
    expect(user).toBeNull();
  });
  it("returns an error if email is undefined", async () => {
    // Act
    const { user, error } = await retrieveEmailAndHashedPasswordGateway(
      container
    )({
      email: undefined,
    });
    // Assert
    expect(error).toEqual("Error retrieving hashedPassword");
    expect(user).toBeNull();
  });
});
