import deleteVisitByCallIdGateway from "../../../src/gateways/MsSQL/deleteVisitByCallId";
import { createVisit } from "../../../test/testUtils/factories";
import AppContainer from "../../../src/containers/AppContainer";

describe("deleteVisitByCallIdGateway", () => {
  const container = AppContainer.getInstance();
  let callId;

  beforeEach(async () => {
    // create visit
    callId = await createVisit();
  });

  it("deletes a visit", async () => {
    const response = await deleteVisitByCallIdGateway(container)(callId);
    console.log(response);
  });
});
