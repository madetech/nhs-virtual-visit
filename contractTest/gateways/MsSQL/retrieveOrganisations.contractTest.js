import retrieveOrganisationsGateWay from "../../../src/gateways/MsSQL/retrieveOrganisations";
import {
  setUpManager,
  setupOrganization,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveOrganisationsGateWay", () => {
  const container = AppContainer.getInstance();

  it("returns an object containing all organisations in db", async () => {
    // Arrange
    const {
      user: { id: userId },
    } = await setUpManager();

    const organisationOne = {
      name: "Organisation One",
      code: "OR1",
    };
    const organisationTwo = {
      name: "Organisation Two",
      code: "OR2",
    };
    const organisationThree = {
      name: "Organisation Three",
      code: "OR3",
    };

    const { organisation: currentOrganisationOne } = await setupOrganization({
      name: organisationOne.name,
      code: organisationOne.code,
      createdBy: userId,
    });
    const { organisation: currentOrganisationTwo } = await setupOrganization({
      name: organisationTwo.name,
      code: organisationTwo.code,
      createdBy: userId,
    });
    const { organisation: currentOrganisationThree } = await setupOrganization({
      name: organisationThree.name,
      code: organisationThree.code,
      createdBy: userId,
    });
    // Act
    const { organisations } = await retrieveOrganisationsGateWay(container)({});
    // Assert
    expect(organisations).orderlessEqual([
      currentOrganisationOne,
      currentOrganisationTwo,
      currentOrganisationThree,
    ]);
  });
});
