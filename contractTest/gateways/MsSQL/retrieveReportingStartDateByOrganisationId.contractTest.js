import retrieveReportingStartDateByOrganisationIdGateway from "../../../src/gateways/MsSQL/retrieveReportingStartDateByOrganisationId";
import AppContainer from "../../../src/containers/AppContainer";
import {
  setupOrganisationFacilityDepartmentAndManager,
  setUpScheduledCall,
} from "../../../test/testUtils/factories";
import { v4 as uuidv4 } from "uuid";
import MockDate from "mockdate";

describe("retrieveReportingStartDateByOrganisationId", () => {
  const container = AppContainer.getInstance();

  it("test", async () => {
    // Arrange
    const {
      orgId,
      departmentId,
    } = await setupOrganisationFacilityDepartmentAndManager();

    const { id: visitId } = await setUpScheduledCall({ departmentId });

    const callSessionId = uuidv4();

    MockDate.set(new Date("2020-006-01 13:00"));

    await container.getCaptureEvent()({
      action: "join-visit",
      visitId,
      callSessionId,
    });

    // Act
    const {
      response,
      error,
    } = await retrieveReportingStartDateByOrganisationIdGateway(container)(
      orgId
    );

    // Assert
    console.log(response);
    expect(error).toBeNull();
  });
});
