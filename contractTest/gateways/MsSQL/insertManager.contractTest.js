import insertManagerGateway from "../../../src/gateways/MsSQL/insertManager";
import { statusToId, DISABLED } from "../../../src/helpers/statusTypes";
import {
  setupOrganization,
  setUpAdmin,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";
import bcrypt from "bcryptjs";

describe("insertManagerGateway", () => {
  const container = AppContainer.getInstance();
  it("returns a user object when a manager is created", async () => {
    // Arrange
    const {
      user: { id: adminId },
    } = await setUpAdmin();
    const { orgId } = await setupOrganization({ createdBy: adminId });
    const newManager = {
      email: "test@nhs.co.uk",
      password: "password",
      organisationId: orgId,
      type: "manager",
    };

    // Act
    const { user, error } = await insertManagerGateway(container)(newManager);
    // Assert
    expect(user.email).toEqual(newManager.email);
    expect(user.organisationId).toEqual(newManager.organisationId);
    expect(user.type).toEqual(newManager.type);
    expect(user.status).toEqual(statusToId(DISABLED));
    expect(bcrypt.compareSync(newManager.password, user.password)).toEqual(
      true
    );
    expect(error).toBeNull();
  });
  it("returns an error if email is undefined", async () => {
    // Arrange
    const {
      user: { id: adminId },
    } = await setUpAdmin();
    const { orgId } = await setupOrganization({ createdBy: adminId });
    const newManager = {
      password: "password",
      organisationId: orgId,
      type: "manager",
    };

    // Act
    const { user, error } = await insertManagerGateway(container)(newManager);
    // Assert
    expect(user).toBeNull();
    expect(error).toBeDefined();
  });
  it("returns an error if password is undefined", async () => {
    // Arrange
    const {
      user: { id: adminId },
    } = await setUpAdmin();
    const { orgId } = await setupOrganization({ createdBy: adminId });
    const newManager = {
      email: "test@nhs.co.uk",
      organisationId: orgId,
      type: "manager",
    };

    // Act
    const { user, error } = await insertManagerGateway(container)(newManager);
    // Assert
    expect(user).toBeNull();
    expect(error).toBeDefined();
  });
  it("returns an error if type is undefined", async () => {
    // Arrange
    const {
      user: { id: adminId },
    } = await setUpAdmin();
    const { orgId } = await setupOrganization({ createdBy: adminId });
    const newManager = {
      email: "test@nhs.co.uk",
      password: "hashed password",
      organisationId: orgId,
    };

    // Act
    const { user, error } = await insertManagerGateway(container)(newManager);
    // Assert
    expect(user).toBeNull();
    expect(error).toBeDefined();
  });
  it("returns an error if organisation id does not exist", async () => {
    // Arrange
    const newManager = {
      email: "test@nhs.co.uk",
      password: "hashed password",
      type: "manager",
      organisationId: 900000,
    };

    // Act
    const { user, error } = await insertManagerGateway(container)(newManager);
    // Assert
    expect(user).toBeNull();
    expect(error).toBeDefined();
  });
});
