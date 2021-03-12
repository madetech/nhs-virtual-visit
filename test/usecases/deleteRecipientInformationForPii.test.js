import deleteRecipientInformationForPii from "../../src/usecases/deleteRecipientInformationForPii";

describe("deleteRecipientInformationForPii", () => {
  
  it("it returns an error if clearOutTime is not defined", async () => {
    const clearOutTime = "";

    const getDeleteRecipientInformationForPiiGateway = jest.fn();

    const deleteRecipientInformation = deleteRecipientInformationForPii({ 
      getDeleteRecipientInformationForPiiGateway
    });
    const { success, message, error } = await deleteRecipientInformation({ clearOutTime })

    expect(success).toBeFalsy();
    expect(message).toEqual("clearOutTime is not defined");
    expect(error).toBe(true);
  });

  it("deletes the recipients data if the clearOutTime is valid", async () => {
    const clearOutTime = new Date(2020, 11, 31);

    const getDeleteRecipientInformationForPiiGatewaySpy = jest
      .fn()
      .mockReturnValue({
        success: true,
        message: "Recipient data cleared",
        error: null,
      });

    const getDeleteRecipientInformationForPiiGateway = jest.fn(() => {
      return getDeleteRecipientInformationForPiiGatewaySpy;
    });

    const deleteRecipientInformation = deleteRecipientInformationForPii({ 
      getDeleteRecipientInformationForPiiGateway
    });
    const { success, message, error } = await deleteRecipientInformation({ clearOutTime })

    expect(success).toBeTruthy();
    expect(message).toEqual("Recipient data cleared");
    expect(error).toBeNull();
    expect(getDeleteRecipientInformationForPiiGatewaySpy).toBeCalledWith({ clearOutTime: new Date(2020, 11, 31) });
  });

  it("returns an error if there is a problem with the database call", async () => {
    const clearOutTime = new Date(2020, 11, 31);

    const getDeleteRecipientInformationForPiiGateway = jest.fn(() => {
      return jest.fn().mockReturnValue({
        success: false,
        message: "No recipient data was deleted",
        error: "Error with DB call",
      });
    });

    const deleteRecipientInformation = deleteRecipientInformationForPii({
      getDeleteRecipientInformationForPiiGateway
    });
    const { success, message, error } = await deleteRecipientInformation({ clearOutTime });

    expect(success).toBeFalsy();
    expect(message).toEqual("No recipient data was deleted");
    expect(error).toEqual("Error with DB call");
  });
});
