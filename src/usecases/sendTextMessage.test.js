import sendTextMessage from "./sendTextMessage";

describe("sendTextMessage", () => {
  let sendSmsSpy;
  let container;

  beforeEach(() => {
    sendSmsSpy = jest.fn();
    container = {
      getNotifyClient: () => ({ sendSms: sendSmsSpy }),
    };
  });

  it("sends a text message", async () => {
    const templateId = "meow-woof-quack";
    const phoneNumber = "07123456789";
    const personalisation = { name_of_doggo: "Moon Moon" };
    const reference = "text-message-one";

    await sendTextMessage(container)(
      templateId,
      phoneNumber,
      personalisation,
      reference
    );

    expect(sendSmsSpy).toHaveBeenCalledWith(
      templateId,
      phoneNumber,
      personalisation,
      reference
    );
  });

  it("returns success if successfully sends a text message", async () => {
    const response = await sendTextMessage(container)("", "", {}, "");

    expect(response).toEqual({ success: true, error: null });
  });

  it("returns the error if Notify raises an error", async () => {
    container = {
      getNotifyClient: () => ({
        sendSms: () => {
          throw "Error message";
        },
      }),
    };

    const response = await sendTextMessage(container)("", "", {}, {});

    expect(response).toEqual({ success: false, error: "Error message" });
  });
});
