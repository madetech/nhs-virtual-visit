import retrieveOrderedActiveCallsByDepartmentId from "../../../src/gateways/MsSQL/retrieveOrderedActiveCallsByDepartmentId";
import { setupOrganisationFacilityDepartmentAndManager, setupVisitMsSQL } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("retrieveOrderedActiveCallsByDepartmentId", () => {
  // Arrange
  const container = AppContainer.getInstance();
  it("returns an object containing the active calls", async () => {
    const { departmentId, userId } = await setupOrganisationFacilityDepartmentAndManager();
    const { visitId } = await setupVisitMsSQL({departmentId});
    //create a few more calls, not just one, including some that aren't active
    //then test to make sure we've only recieved the active ones  and to make sure
    //they're in order
  });
});
