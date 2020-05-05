import { NotifyClient } from "notifications-node-client";
import TemplateStore from "../gateways/GovNotify/TemplateStore";
import sendTextMessage from "./sendTextMessage";
import fillObjectWithStrings from "../testUtils/fillObjectWithStrings";

describe("sendTextMessage", () => {
  const { templateId, personalisationKeys } = TemplateStore.firstText;
  const personalisation = fillObjectWithStrings(personalisationKeys);

  const phoneNumber = "07123456789";
  const reference = "text-message-one";

  let notifyClient;
  let container;

  beforeEach(() => {
    notifyClient = new NotifyClient();
    container = {
      getNotifyClient: () => notifyClient,
    };
  });

  it("sends a text message", async () => {
    await sendTextMessage(container)(
      templateId,
      phoneNumber,
      personalisation,
      reference
    );

    expect(notifyClient.sendSms).toHaveBeenCalledWith(templateId, phoneNumber, {
      personalisation,
      reference,
    });
  });

  it("returns success if successfully sends a text message", async () => {
    const response = await sendTextMessage(container)(
      templateId,
      phoneNumber,
      personalisation,
      reference
    );

    expect(response).toEqual({ success: true, error: null });
  });

  it("returns the error if Notify raises an error", async () => {
    const response = await sendTextMessage(container)(
      "3b45757d-aaaa-4e33-ac7c-00674a70888d",
      "",
      {},
      {}
    );

    expect(response).toEqual({
      success: false,
      error: "GovNotify error occurred: Template not found",
    });
  });
});
