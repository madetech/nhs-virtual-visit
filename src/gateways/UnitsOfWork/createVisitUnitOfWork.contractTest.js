import AppContainer from "../../containers/AppContainer";
import { setupWardWithinHospitalAndTrust } from "../../testUtils/factories";

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
    await container.getCreateVisitUnitOfWork()(
      {
        patientName: "Patient Name",
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
        callTime: date,
        callId: "123",
        provider: "jitsi",
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
    await container.getCreateVisitUnitOfWork()(
      {
        patientName: "Patient Name",
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
        callTime: date,
        callId: "two",
        provider: "jitsi",
        callPassword: "DAVE",
      },
      ward
    );

    await container.getCreateVisitUnitOfWork()(
      {
        patientName: "Test Patient",
        contactEmail: "test@testemail.com",
        contactName: "Test Contact",
        callTime: new Date(),
        callId: "456",
        provider: "jitsi",
        callPassword: "securePassword",
      },
      ward
    );

    const { total } = await container.getRetrieveWardVisitTotals()(trustId);
    expect(total).toEqual(2);
  });

  it("sends booking notification", async () => {
    const {
      bookingNotificationSuccess,
      bookingNotificationErrors,
    } = await container.getCreateVisitUnitOfWork()(
      {
        patientName: "Patient Name",
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
        callTime: date,
        callId: "two",
        provider: "jitsi",
        callPassword: "testpassword",
      },
      ward
    );

    expect(bookingNotificationSuccess).toEqual(true);
    expect(bookingNotificationErrors).toEqual(null);
  });
});
