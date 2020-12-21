import AppContainer from "../../../src/containers/AppContainer";
import { setupWardWithinHospitalAndTrust } from "../../../test/testUtils/factories";
import createVisitUnitOfWork from "../../../src/gateways/UnitsOfWork/createVisitUnitOfWork";

describe("createVisitUnitOfWork tests", () => {
  const container = AppContainer.getInstance();

  let date = new Date();
  date.setDate(date.getDate() + 1);
  let ward = {};
  let wardId;
  let trustId;

  beforeEach(async () => {
    const wardResponse = await setupWardWithinHospitalAndTrust();

    wardId = wardResponse.wardId;
    trustId = wardResponse.trustId;
    ward = {
      id: wardId,
      name: "test ward",
      hospitalName: "test hospital",
    };
  });

  it("creates a visit", async () => {
    const sendBookingNotification = container.getSendBookingNotification();
    await createVisitUnitOfWork(sendBookingNotification)(
      {
        patientName: "Patient Name",
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
        callTime: date,
        callId: "123",
        provider: "whereby",
        callPassword: "DAVE",
      },
      ward
    );

    const { scheduledCalls } = await container.getRetrieveVisits()({ wardId });
    expect(scheduledCalls).toEqual([
      expect.objectContaining({ patientName: "Patient Name" }),
    ]);
  });

  it("updates ward totals", async () => {
    const sendBookingNotification = container.getSendBookingNotification();
    await createVisitUnitOfWork(sendBookingNotification)(
      {
        patientName: "Patient Name",
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
        callTime: date,
        callId: "two",
        provider: "whereby",
        callPassword: "DAVE",
      },
      ward
    );

    await createVisitUnitOfWork(sendBookingNotification)(
      {
        patientName: "Test Patient",
        contactEmail: "test@testemail.com",
        contactName: "Test Contact",
        callTime: new Date(),
        callId: "456",
        provider: "whereby",
        callPassword: "securePassword",
      },
      ward
    );

    const { total } = await container.getRetrieveWardVisitTotals()(trustId);
    expect(total).toEqual(2);
  });

  it("sends booking notification", async () => {
    const sendBookingNotification = container.getSendBookingNotification();
    const { success, error } = await createVisitUnitOfWork(
      sendBookingNotification
    )(
      {
        patientName: "Patient Name",
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
        callTime: date,
        callId: "two",
        provider: "whereby",
        callPassword: "testpassword",
      },
      ward
    );

    expect(success).toEqual(true);
    expect(error).toEqual(null);
  });

  it("rolls back db calls when sendBookingNotification throws error in transaction", async () => {
    const sendBookingNotificationStub = jest.fn().mockImplementation(() => {
      throw "Some error!";
    });

    const { success, error } = await createVisitUnitOfWork(
      sendBookingNotificationStub
    )(
      {
        patientName: "Patient Name",
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
        callTime: date,
        callId: "two",
        provider: "whereby",
        callPassword: "DAVE",
      },
      ward
    );

    expect(success).toEqual(false);
    expect(error).toEqual("Some error!");
    const { total } = await container.getRetrieveWardVisitTotals()(trustId);
    expect(total).toEqual(0);
    const { scheduledCalls } = await container.getRetrieveVisits()({ wardId });
    expect(scheduledCalls).toEqual([]);
  });

  it("rolls back db calls when sendBookingNotification returns error in transaction", async () => {
    const sendBookingNotificationStub = jest.fn().mockResolvedValue({
      success: false,
      errors: {
        textMessageError: "Failed to send text message!",
        emailError: "Failed to send email!",
      },
    });

    const { success, error } = await createVisitUnitOfWork(
      sendBookingNotificationStub
    )(
      {
        patientName: "Patient Name",
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
        callTime: date,
        callId: "two",
        provider: "whereby",
        callPassword: "DAVE",
      },
      ward
    );

    expect(success).toEqual(false);
    expect(error).toEqual("Failed to send notification");
    const { total } = await container.getRetrieveWardVisitTotals()(trustId);
    expect(total).toEqual(0);
    const { scheduledCalls } = await container.getRetrieveVisits()({ wardId });
    expect(scheduledCalls).toEqual([]);
  });
});
