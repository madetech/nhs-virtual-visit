import { NotifyClient } from "notifications-node-client";
import TemplateStore from "../gateways/GovNotify/TemplateStore";
import sendEmail from "./sendEmail";
import fillObjectWithStrings from "../testUtils/fillObjectWithStrings";

describe("sendEmail", () => {
  const { templateId, personalisationKeys } = TemplateStore.firstEmail;
  const personalisation = fillObjectWithStrings(personalisationKeys);

  const emailAddress = "test@example.com";
  const reference = "email-one-reference";

  let notifyClient;
  let container;

  beforeEach(() => {
    notifyClient = new NotifyClient();
    notifyClient.sendEmail = jest.fn(notifyClient.sendEmail);
    container = {
      getNotifyClient: () => notifyClient,
    };
  });

  it("sends an email message", async () => {
    await sendEmail(container)(
      templateId,
      emailAddress,
      personalisation,
      reference
    );

    expect(notifyClient.sendEmail).toHaveBeenCalledWith(
      templateId,
      emailAddress,
      {
        personalisation,
        reference,
      }
    );
  });

  it("returns success if it successfully sends an email", async () => {
    const response = await sendEmail(container)(
      templateId,
      emailAddress,
      personalisation,
      reference
    );

    expect(response).toEqual({ success: true, error: null });
  });

  it("returns the error if GovNotify raises an error", async () => {
    const response = await sendEmail(container)(
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
