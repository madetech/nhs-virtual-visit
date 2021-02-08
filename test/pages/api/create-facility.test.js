import createFacility from "../../../pages/api/create-facility";
import mockAppContainer from "src/containers/AppContainer";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";
describe("create-facility", () => {
  // Arrange
  let validRequest, response;
  const expectedUuid = "uuid";
  const createFacilitySpy = jest.fn(() =>
    Promise.resolve({ uuid: expectedUuid, error: null })
  );
  beforeEach(() => {
    validRequest = {
      method: "POST",
      body: {
        name: "Yugi Muto Hospital",
        orgId: "1",
        code: "YMH",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    response = {
      status: jest.fn(),
      setHeader: jest.fn(),
      send: jest.fn(),
      end: jest.fn(),
      body: jest.fn(),
    };
    mockAppContainer.getOrganisationAdminIsAuthenticated.mockImplementation(
      () => jest.fn(() => ({ type: TRUST_ADMIN, trustId: 1, userId: 10 }))
    );
    mockAppContainer.getCreateFacility.mockImplementation(
      () => createFacilitySpy
    );
  });

  it("returns 405 if not POST method", async () => {
    // Arrange
    validRequest.method = "GET";
    // Act
    await createFacility(validRequest, response, {
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
    await createFacility(
      {
        method: "POST",
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

  it("creates a new facility if valid", async () => {
    // Act
    await createFacility(validRequest, response, {
      container: mockAppContainer,
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ uuid: expectedUuid })
    );
    expect(createFacilitySpy).toHaveBeenCalledWith({
      code: "YMH",
      name: "Yugi Muto Hospital",
      orgId: "1",
      createdBy: 10,
    });
  });

  it("returns a 400 status if errors", async () => {
    // Arrange
    const createFacilityStub = jest
      .fn()
      .mockReturnValue({ uuid: null, error: "Error message" });
    mockAppContainer.getCreateFacility.mockImplementation(
      () => createFacilityStub
    );
    // Act
    await createFacility(validRequest, response, {
      container: {
        ...mockAppContainer,
      },
    });
    // Assert
  });

  it("returns a 400 if the name is an empty string", async () => {
    // Arrange
    const invalidRequest = {
      method: "POST",
      body: {
        name: "",
        orgId: 2,
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    // Act
    await createFacility(invalidRequest, response, {
      container: { ...mockAppContainer },
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "name must be present" })
    );
  });

  it("returns a 400 if the name is not provided", async () => {
    // Arrange
    const invalidRequest = {
      method: "POST",
      body: {
        orgId: 1,
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    // Act
    await createFacility(invalidRequest, response, {
      container: { ...mockAppContainer },
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "name must be present" })
    );
  });

  it("returns a 400 if the facility name is an empty string", async () => {
    // Arrange
    const invalidRequest = {
      method: "POST",
      body: {
        name: "",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    // Act
    await createFacility(invalidRequest, response, {
      container: { ...mockAppContainer },
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "name must be present" })
    );
  });

  it("returns a 400 if the organisation ID is not provided", async () => {
    // Arrange
    const invalidRequest = {
      method: "POST",
      body: {
        name: "Seto Kaiba Ward",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    // Act
    await createFacility(invalidRequest, response, {
      container: { ...mockAppContainer },
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "facility id must be present" })
    );
  });
});
