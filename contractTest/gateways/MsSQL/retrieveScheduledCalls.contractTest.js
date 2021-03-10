import retrieveScheduledCallsGateway from "../../../src/gateways/MsSQL/retrieveScheduledCalls";
import {
  setupOrganisationFacilityDepartmentAndManager,
  setUpScheduledCalls,
} from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";
import moment from "moment";

describe("retrieveScheduledCalls", () => {
  const container = AppContainer.getInstance();

  it("retrieves a list of calls that have happened", async () => {
    // Arrange
    const currentDateTime = new Date();
    console.log(currentDateTime);
    const dateTime = new Date( new Date(Date.now()).setHours(1, 0, 0));
    console.log(dateTime);
    const newVisit1 = {
      patientName: "New patient",
      recipientEmail: "newtest@testemail.com",
      recipientName: "New recipient name",
      recipientNumber: "01234567890",
      callPassword: "foo",

    }
    // Act
    // Assert
  })
})