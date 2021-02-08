import createOrganisationGateway from "../../../src/gateways/MsSQL/createOrganisation";
import { setUpAdmin } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("createOrganisationGateway", () => {
  // Arrange
  const container = AppContainer.getInstance();
  let newOrganisation;
  beforeEach(async () => {
    const { user } = await setUpAdmin();
    const adminId = user.id;
    newOrganisation = {
      name: "Organisation One",
      type: "trust",
      createdBy: adminId,
    };
  });
  it("returns an object containing the organisation", async () => {
    // Act
    const {
      organisation: createdOrganisation,
      error,
    } = await createOrganisationGateway(container)(newOrganisation);
    const {
      organisation: retrievedOrganisation,
    } = await container.getRetrieveOrganisationByIdGateway()(
      createdOrganisation.id
    );
    // Assert
    expect(error).toBeNull();
    expect(createdOrganisation).toEqual(retrievedOrganisation);
  });
  it("returns an error if type is undefined", async () => {
    // Act
    const { organisation, error } = await createOrganisationGateway(container)({
      ...newOrganisation,
      type: undefined,
    });
    // Assert
    expect(organisation).toBeNull();
    expect(error).toBeTruthy();
  });
});
