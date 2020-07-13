import sendBookingNotification from "./sendBookingNotification";
import TemplateStore from "../gateways/GovNotify/TemplateStore";

describe("sendBookingNotification", () => {
  const textMessageTemplateId = TemplateStore().firstText.templateId;
  const emailTemplateId = TemplateStore().firstEmail.templateId;
  const mobileNumber = "07123456789";
  const emailAddress = "test@example.com";
  const wardName = "Test Ward";
  const hospitalName = "Test Hospital";
  const visitDateAndTime = new Date("2020-06-01 13:00");
  const personalisation = {
    visit_date: "1 June 2020",
    visit_time: "1:00pm",
    ward_name: wardName,
    hospital_name: hospitalName,
  };

  let sendTextMessage;
  let sendEmail;
  let container;

  beforeEach(() => {
    sendTextMessage = jest
      .fn()
      .mockResolvedValue({ success: true, error: null });
    sendEmail = jest.fn().mockResolvedValue({ success: true, error: null });
    container = {
      getSendTextMessage: () => sendTextMessage,
      getSendEmail: () => sendEmail,
    };
  });

  describe("when a mobile number and email address is provided", () => {
    it("sends a text message and email", async () => {
      const { success, errors } = await sendBookingNotification(container)({
        mobileNumber,
        emailAddress,
        wardName,
        hospitalName,
        visitDateAndTime,
      });

      expect(success).toBeTruthy();
      expect(errors).toBeNull();
      expect(sendTextMessage).toHaveBeenCalledWith(
        textMessageTemplateId,
        mobileNumber,
        personalisation,
        null
      );
      expect(sendEmail).toHaveBeenCalledWith(
        emailTemplateId,
        emailAddress,
        personalisation,
        null
      );
    });

    it("returns an error if sending a text message and email fails", async () => {
      sendTextMessage = jest.fn().mockResolvedValue({
        success: false,
        error: "Failed to send text message!",
      });
      sendEmail = jest.fn().mockResolvedValue({
        success: false,
        error: "Failed to send email!",
      });
      container = {
        getSendTextMessage: () => sendTextMessage,
        getSendEmail: () => sendEmail,
      };

      const { success, errors } = await sendBookingNotification(container)({
        mobileNumber,
        emailAddress,
        wardName,
        hospitalName,
        visitDateAndTime,
      });

      expect(success).toBeFalsy();
      expect(errors).toEqual({
        emailError: "Failed to send email!",
        textMessageError: "Failed to send text message!",
      });
    });
  });

  describe("when only a mobile number is provided", () => {
    it("sends a text message", async () => {
      const { success, errors } = await sendBookingNotification(container)({
        mobileNumber,
        wardName,
        hospitalName,
        visitDateAndTime,
      });

      expect(success).toBeTruthy();
      expect(errors).toBeNull();
      expect(sendTextMessage).toHaveBeenCalledWith(
        textMessageTemplateId,
        mobileNumber,
        personalisation,
        null
      );
      expect(sendEmail).not.toHaveBeenCalled();
    });

    it("returns an error if sending a text message fails", async () => {
      sendTextMessage = jest.fn().mockResolvedValue({
        success: false,
        error: "Failed to send text message!",
      });
      container = {
        getSendTextMessage: () => sendTextMessage,
        getSendEmail: () => sendEmail,
      };

      const { success, errors } = await sendBookingNotification(container)({
        mobileNumber,
        wardName,
        hospitalName,
        visitDateAndTime,
      });

      expect(success).toBeFalsy();
      expect(errors).toEqual({
        emailError: null,
        textMessageError: "Failed to send text message!",
      });
    });
  });

  describe("when only an email address is provided", () => {
    it("sends an email", async () => {
      const { success, errors } = await sendBookingNotification(container)({
        emailAddress,
        wardName,
        hospitalName,
        visitDateAndTime,
      });

      expect(success).toBeTruthy();
      expect(errors).toBeNull();
      expect(sendEmail).toHaveBeenCalledWith(
        emailTemplateId,
        emailAddress,
        personalisation,
        null
      );
      expect(sendTextMessage).not.toHaveBeenCalled();
    });
  });

  it("returns an error if sending an email fails", async () => {
    sendEmail = jest
      .fn()
      .mockResolvedValue({ success: false, error: "Failed to send email!" });
    container = {
      getSendTextMessage: () => sendTextMessage,
      getSendEmail: () => sendEmail,
    };

    const { success, errors } = await sendBookingNotification(container)({
      emailAddress,
      wardName,
      hospitalName,
      visitDateAndTime,
    });

    expect(success).toBeFalsy();
    expect(errors).toEqual({
      emailError: "Failed to send email!",
      textMessageError: null,
    });
  });

  describe("when we set the notificationType to updated", () => {
    it("uses the correct text message and email template", async () => {
      const textMessageUpdatedTemplateId = TemplateStore().updatedVisitText
        .templateId;
      const emailUpdatedTemplateId = TemplateStore().updatedVisitEmail
        .templateId;

      const { success, errors } = await sendBookingNotification(container)({
        mobileNumber,
        emailAddress,
        wardName,
        hospitalName,
        visitDateAndTime,
        notificationType: "updated",
      });

      expect(success).toBeTruthy();
      expect(errors).toBeNull();
      expect(sendTextMessage).toHaveBeenCalledWith(
        textMessageUpdatedTemplateId,
        mobileNumber,
        personalisation,
        null
      );
      expect(sendEmail).toHaveBeenCalledWith(
        emailUpdatedTemplateId,
        emailAddress,
        personalisation,
        null
      );
    });
  });
});
