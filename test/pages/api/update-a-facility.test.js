import updateAFacility from "../../../pages/api/update-a-facility";
import mockAppContainer from "src/containers/AppContainer";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";

describe("update-a-facility", () => {
  let validRequest, response;
  const expectedUuid = "facility-uuid";
  const expectedFacilityId = 1;
  const expectedFacility = { id: expectedFacilityId };
  const expectedFacilityObject = {
    uuid: expectedUuid,
    name: "Hospital Name",
    status: "active",
  };
  const updateFacilitySpy = jest
    .fn()
    .mockResolvedValue({ uuid: expectedUuid, error: null });
  beforeEach(() => {
    validRequest = {
      method: "PATCH",
      body: expectedFacilityObject,
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    response = {
      status: jest.fn(),
      setHeader: jest.fn(),
      end: jest.fn(),
      body: jest.fn(),
    };
    mockAppContainer.getOrganisationAdminIsAuthenticated.mockImplementation(
      () => jest.fn(() => true)
    );
    mockAppContainer.getTokenProvider.mockImplementation(
      jest.fn({ type: TRUST_ADMIN, trustId: 1 })
    );
    mockAppContainer.getUpdateFacilityById.mockImplementation(
      () => updateFacilitySpy
    );
    mockAppContainer.getRetrieveFacilityByUuid.mockImplementation(() =>
      jest.fn().mockResolvedValue({ facility: expectedFacility, error: null })
    );
  });

  it("returns 405 if not PATCH method", async () => {
    // Arrange
    validRequest.method = "GET";
    // Act
    await updateAFacility(validRequest, response, {
      container: mockAppContainer,
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 401 if no token provided", async () => {
    // Arrange
    const trustAdminIsAuthenticatedSpy = jest.fn().mockReturnValue(false);
    mockAppContainer.getOrganisationAdminIsAuthenticated.mockImplementationOnce(
      () => trustAdminIsAuthenticatedSpy
    );
    // Act
    await updateAFacility(
      {
        method: "PATCH",
        body: {},
        headers: {},
      },
      response,
      {
        container: mockAppContainer,
      }
    );
    // Assert
    expect(response.status).toHaveBeenCalledWith(401);
    expect(trustAdminIsAuthenticatedSpy).toHaveBeenCalled();
  });

  it("returns a 400 status if body is not provided", async () => {
    // Act
    await updateAFacility(
      {
        method: "PATCH",
        headers: {
          cookie: "token=valid.token.value",
        },
      },
      response,
      {
        container: mockAppContainer,
      }
    );
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "facility uuid and must be present",
      })
    );
  });

  it("returns a 400 if uuid is not provided", async () => {
    // Arrange
    const invalidRequest = {
      method: "PATCH",
      body: { ...expectedFacilityObject, uuid: undefined },
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    // Act
    await updateAFacility(invalidRequest, response, {
      container: mockAppContainer,
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "facility uuid and must be present",
      })
    );
  });

  it("returns a 400 if name is not provided", async () => {
    // Arrange
    const invalidRequest = {
      method: "PATCH",
      body: { ...expectedFacilityObject, name: undefined },
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    // Act
    await updateAFacility(invalidRequest, response, {
      container: mockAppContainer,
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "facility uuid and must be present",
      })
    );
  });

  it("returns a 400 if uuid is an empty string", async () => {
    // Arrange
    const invalidRequest = {
      method: "PATCH",
      body: { ...expectedFacility, uuid: "" },
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    // Act
    await updateAFacility(invalidRequest, response, {
      container: mockAppContainer,
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "facility uuid and must be present",
      })
    );
  });

  it("returns a 400 if name is an empty string", async () => {
    // Arrange
    const invalidRequest = {
      method: "PATCH",
      body: { ...expectedFacility, name: "" },
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    // Act
    await updateAFacility(invalidRequest, response, {
      container: mockAppContainer,
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "facility uuid and must be present",
      })
    );
  });

  it("returns a 404 if facility does not exist", async () => {
    // Arrange
    const retrieveFacilityByUuidSpy = jest.fn(() =>
      Promise.resolve({
        error: "facility does not exist in current organisation",
      })
    );
    mockAppContainer.getRetrieveFacilityByUuid.mockImplementationOnce(
      () => retrieveFacilityByUuidSpy
    );
    // Act
    await updateAFacility(validRequest, response, {
      container: mockAppContainer,
    });
    // Assert
    expect(retrieveFacilityByUuidSpy).toHaveBeenCalledWith(expectedUuid);
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "facility does not exist in current organisation",
      })
    );
  });

  it("updates facility with new name from payload", async () => {
    // Arrange
    const updateFacilitySpy = jest
      .fn()
      .mockResolvedValue({ uuid: expectedUuid, error: null });
    mockAppContainer.getUpdateFacilityById.mockImplementationOnce(
      () => updateFacilitySpy
    );
    // Act
    await updateAFacility(validRequest, response, {
      container: mockAppContainer,
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ uuid: expectedUuid })
    );
    expect(updateFacilitySpy).toHaveBeenCalledWith({
      id: expectedFacilityId,
      name: expectedFacilityObject.name,
    });
  });

  it("returns a 500 if facility fails to update", async () => {
    // Arrange
    const updateFacilitySpy = jest.fn(async () => {
      throw new Error("ERROR!");
    });
    mockAppContainer.getUpdateFacilityById.mockImplementationOnce(
      () => updateFacilitySpy
    );
    // Act
    await updateAFacility(validRequest, response, {
      container: mockAppContainer,
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "500 (Internal Server Error). Please try again later.",
      })
    );
  });
});
