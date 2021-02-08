import retrieveActiveOrganisationsGateWay from "../../../src/gateways/MsSQL/retrieveActiveOrganisations";
import {
  setUpAdmin,
  setupOrganization,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";
import { statusToId, ACTIVE } from "../../../src/helpers/statusTypes";

describe("retrieveActiveOrganisationsGateWay", () => {
  const container = AppContainer.getInstance();

  it("returns an object containing all organisations in db which have status ACTIVE", async () => {
    // Arrange
    const {
      user: { id: adminId },
    } = await setUpAdmin();

    const newOrganisationOne = {
      name: "Organisation One",
      code: "OR1",
      createdBy: adminId,
    };
    const newOrganisationTwo = {
      name: "Organisation Two",
      code: "OR2",
      createdBy: adminId,
    };
    const newOrganisationThree = {
      name: "Organisation Three",
      code: "OR3",
      createdBy: adminId,
    };

    const { organisation: organisationOne } = await setupOrganization(
      newOrganisationOne
    );
    const { organisation: organisationTwo } = await setupOrganization(
      newOrganisationTwo
    );
    await setupOrganization(newOrganisationThree);

    await container.getActivateOrganisationGateway()({
      organisationId: organisationOne.id,
      status: statusToId(ACTIVE),
    });
    await container.getActivateOrganisationGateway()({
      organisationId: organisationTwo.id,
      status: statusToId(ACTIVE),
    });
    // Act
    const { organisations } = await retrieveActiveOrganisationsGateWay(
      container
    )({});
    // Assert
    expect(organisations).orderlessEqual([
      { ...organisationOne, status: statusToId(ACTIVE) },
      { ...organisationTwo, status: statusToId(ACTIVE) },
    ]);
  });
});
