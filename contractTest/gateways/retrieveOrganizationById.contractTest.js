import retrieveOrganizationById from "../../src/gateways/retrieveOrganizationById";
<<<<<<< HEAD:contractTest/usecases/retrieveOrganizationById.contractTest.js
import { setupOrganization } from "../testUtils/factories";
=======
import { setupOrganization } from "../../test/testUtils/factories";
>>>>>>> fix: fixing database seeding:contractTest/gateways/retrieveOrganizationById.contractTest.js

describe("retrieveOrganizationById", () => {
  it("returns an object containing the organization", async () => {
    const { organizationId } = await setupOrganization();

    const { organization, error } = await retrieveOrganizationById(
      organizationId
    );

    expect(error).toBeNull();
    expect(organization).toEqual({
      id: organizationId,
      name: "Test Trust",
      status: 0,
    });
  });

  it("returns an error when trust not found for id", async () => {
    const { error } = await retrieveOrganizationById(12);
    expect(error).toBeDefined();
    expect(error).toEqual("Trust not found for id");
  });

  it("returns an error when trust id not set", async () => {
    const { error } = await retrieveOrganizationById();
    expect(error).toBeDefined();
    expect(error).toEqual("Attempting to retrieve trust with no trust Id set");
  });
});
