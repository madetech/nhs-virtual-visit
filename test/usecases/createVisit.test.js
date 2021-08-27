import createVisit from "../../src/usecases/createVisit";
import logger from "../../logger"

describe("createVisit", () => {

  let injectedMockFunctions = {};
  let date = new Date();

  date.setDate(date.getDate() + 1);

  /* ----------------------- Test data setup -----------------------*/
  const visit = {
    patientName: "Patient Name",
    contactEmail: "contact@example.com",
    contactName: "Contact Name",
    callTime: date,
    recipientName: "The recipient",
    recipientEmail: "recipient@example.com",
    recipientNumber: "07777123456"
  };

  const callId = "789xyz";
  const callPassword = "anothertestpassword";
  const videoProvider = "anotherTestProvider";
  const wardId = "wardId";
  const ward = { id: wardId, name: "wardName", hospitalName: "hospitalName" };

  /* ----------------------- Mock configuration -----------------------*/
  const configureMocks = (simulateInsertVisitError, simulateRetrieveFacilityError, simulateNotificationError) => {
    // eslint-disable-next-line no-unused-vars
    injectedMockFunctions.getInsertVisitGateway = jest.fn().mockImplementation(() => async(populatedVisit, ward) => {
      return {error: simulateInsertVisitError };
    });
    // eslint-disable-next-line no-unused-vars
    injectedMockFunctions.getRetrieveFacilityById = jest.fn(() => async(facilityId) => {
      return { error: simulateRetrieveFacilityError, facility: { name: "Test" } }; });
    // eslint-disable-next-line no-empty-pattern
    injectedMockFunctions.getSendBookingNotification = jest.fn(() => async ({}) => {
      return { errors: simulateNotificationError };});
    injectedMockFunctions.logger = logger;
  };

  /* ----------------------- Test cases -----------------------*/
  it("returns success when valid arguments are supplied", async () => {
    configureMocks(false, false, false);

    const response = await createVisit(injectedMockFunctions)(
      visit,
      ward,
      callId,
      callPassword,
      videoProvider
    );

    expect(response.success).toBeTruthy();
  });

  it("returns error if booking notification error", async () => {
    configureMocks(false, false, true);

    const response = await createVisit(injectedMockFunctions)(
      visit,
      ward,
      callId,
      callPassword,
      videoProvider
    );

    expect(response.success).toBeFalsy();
  });

  it("returns error if invalid visit", async () => {
    configureMocks(true, false, false);

    const response = await createVisit(injectedMockFunctions)(
      visit,
      ward,
      callId,
      callPassword,
      videoProvider
    );

    expect(response.success).toBeFalsy();
  });

  it("returns error if cannot retrieve facility", async() => {
    configureMocks(false, true, false);

    const response = await createVisit(injectedMockFunctions)(
      visit,
      ward,
      callId,
      callPassword,
      videoProvider
    );

    expect(response.success).toBeFalsy();
  });
});
