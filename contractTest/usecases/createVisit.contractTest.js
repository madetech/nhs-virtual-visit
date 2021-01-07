import createVisitUnitOfWork from "../../src/gateways/UnitsOfWork/createVisitUnitOfWork";
import createVisit from "../../src/usecases/createVisit";
import sendBookingNotification from "../../src/usecases/sendBookingNotification";
import sendEmail from "../../src/usecases/sendEmail";
import sendTextMessage from "../../src/usecases/sendTextMessage";
import Notify from "../../src/gateways/GovNotify";

import { setupWardWithinHospitalAndTrust } from "../../test/testUtils/factories";

describe("createVisit contract tests", () => {
  it("creates a visit", async () => {
    const getNotifyClient = () => {
      return Notify.getInstance();
    };
    const getSendTextMessage = () => {
      return sendTextMessage({ getNotifyClient });
    };
    const getSendEmail = () => {
      return sendEmail({ getNotifyClient });
    };
    const sendBookingNotificationInstance = sendBookingNotification({
      getSendTextMessage,
      getSendEmail,
    });
    const createVisitUnitOfWorkInstance = createVisitUnitOfWork(
      sendBookingNotificationInstance
    );

    const { wardId } = await setupWardWithinHospitalAndTrust({
      index: 1,
    });

    const ward = {
      id: wardId,
      name: "Test Ward",
      hospitalName: "Test Hospital",
    };

    const callId = "123abc";
    const callPassword = "testpassword";
    const videoProvider = "whereby";

    let date = new Date();
    date.setDate(date.getDate() + 1);

    const { success } = await createVisit(createVisitUnitOfWorkInstance)(
      {
        patientName: "Patient Name",
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
        callTime: date,
        callId: "two",
        provider: "whereby",
        callPassword: "DAVE",
      },
      ward,
      callId,
      callPassword,
      videoProvider
    );

    expect(success).toEqual(true);
  });

  it("returns error when booking notification error", async () => {
    const sendBookingNotificationStub = jest.fn().mockResolvedValue({
      success: false,
      errors: {
        textMessageError: "Failed to send text message!",
        emailError: "Failed to send email!",
      },
    });

    const createVisitUnitOfWorkInstance = createVisitUnitOfWork(
      sendBookingNotificationStub
    );

    const { wardId } = await setupWardWithinHospitalAndTrust({
      index: 1,
    });

    const ward = {
      id: wardId,
      name: "Test Ward",
      hospitalName: "Test Hospital",
    };

    const callId = "123abc";
    const callPassword = "testpassword";
    const videoProvider = "whereby";

    let date = new Date();
    date.setDate(date.getDate() + 1);

    const { success, err } = await createVisit(createVisitUnitOfWorkInstance)(
      {
        patientName: "Patient Name",
        contactEmail: "contact@example.com",
        contactName: "Contact Name",
        callTime: date,
        callId: "two",
        provider: "whereby",
        callPassword: "DAVE",
      },
      ward,
      callId,
      callPassword,
      videoProvider
    );

    expect(success).toEqual(false);
    expect(err).toEqual("Failed to send notification");
  });
});
