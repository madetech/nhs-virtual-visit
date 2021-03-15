import deletePersonalCallInformation from "../../../pages/api/delete-personal-call-information";
import mockAppContainer from "src/containers/AppContainer";

describe("deletePersonalCallInformation", () => {
  let validRequest, response;

  beforeEach(() => {
    validRequest = {
      method: "PATCH",
      body: { clearOutTime: new Date(2021, 0, 27) },
    };
    response = {
      status: jest.fn(),
      setHeader: jest.fn(),
      send: jest.fn(),
      end: jest.fn(),
      body: jest.fn(),
    };
    mockAppContainer.getDeleteRecipientInformationForPii.mockImplementation(
      () => jest.fn(() => ({ message: "Recipient call information deleted" }))
    );
  });

  it("returns 405 if not a DELETE method", async () => {
    validRequest.method = "GET";

    await deletePersonalCallInformation(validRequest, response, {
      container: mockAppContainer
    });
    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns 401 if there is no clearOutTime provided", async () => {
    validRequest.body = {};
    await deletePersonalCallInformation(validRequest, response, {
      container: mockAppContainer,
    });

    expect(response.status).toHaveBeenCalledWith(401);
  });

  it("returns 201 if the delete call is successful", async () => {
    const deleteRecipientInformationForPiiSpy = jest.fn().mockReturnValue({
      message: "Recipient call information deleted",
      error: null, 
    });

    mockAppContainer.getDeleteRecipientInformationForPii = jest.fn(() => deleteRecipientInformationForPiiSpy);
    await deletePersonalCallInformation(validRequest, response, {
      container: mockAppContainer
    });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ message: "Recipient call information deleted" })
    );
    expect(deleteRecipientInformationForPiiSpy).toHaveBeenCalledWith({ "clearOutTime": validRequest.body.clearOutTime });
  });

  it("returns 401 if the delete call is unsuccessful", async () => {
    const deleteRecipientInformationForPii = jest.fn().mockReturnValue({
      message: "Recipient data couldn't be deleted due to an error",
      error: true, 
    });

    mockAppContainer.getDeleteRecipientInformationForPii = jest.fn(() => deleteRecipientInformationForPii);
    await deletePersonalCallInformation(validRequest, response, {
      container: mockAppContainer
    });

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "Recipient data couldn't be deleted due to an error" })
    );
  });


});
