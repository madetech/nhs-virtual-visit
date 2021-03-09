import deleteRecipientInformationForPii from "../../src/usecases/deleteRecipientInformationForPii";

describe("deleteRecipientInformationForPii", () => {
  
  it("it returns an error if callId is not defined", async () => {
    const callId = "";

    const getDeleteRecipientInformationForPiiGateway = jest.fn();

    const deleteRecipientInformation = deleteRecipientInformationForPii({ 
      getDeleteRecipientInformationForPiiGateway
    });
    const { success, error } = await deleteRecipientInformation({ callId })

    expect(success).toBeFalsy();
    expect(error).toEqual("callId is not defined");
  });

  it("deletes the recipients data if the callId is valid", async () => {
    const callId = 1;

    const getDeleteRecipientInformationForPiiGatewaySpy = jest
      .fn()
      .mockReturnValue({
        success: true,
        error: null,
      });

    const getDeleteRecipientInformationForPiiGateway = jest.fn(() => {
      return getDeleteRecipientInformationForPiiGatewaySpy;
    });

    const deleteRecipientInformation = deleteRecipientInformationForPii({ 
      getDeleteRecipientInformationForPiiGateway
    });
    const { success, error } = await deleteRecipientInformation({ callId })

    expect(success).toBeTruthy();
    expect(error).toBeNull();
    expect(getDeleteRecipientInformationForPiiGatewaySpy).toBeCalledWith({ callId: 1})
  });

  it("returns an error if there is a problem with the database call", async () => {
    const callId = 1;

    const getDeleteRecipientInformationForPiiGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        success: false,
        error: "Error with DB call",
      });
    });

    const deleteRecipientInformation = deleteRecipientInformationForPii({
      getDeleteRecipientInformationForPiiGateway
    });
    const { success, error } = await deleteRecipientInformation({ callId });

    expect(success).toBeFalsy();
    expect(error).toEqual("Error with DB call");
  });
});
