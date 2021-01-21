import createFacility from "../../../pages/api/create-facility";

describe("create-facility", () => {
  // Arrange
  let validRequest, response, container;
  const createFacilitySpy = jest
    .fn()
    .mockReturnValue({ facilityId: 1, error: null });
  beforeEach(() => {
    validRequest = {
      method: "POST",
      body: {
        name: "Yugi Muto Hospital",
        orgId: "1",
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
    container = {
      getCreateFacility: () => createFacilitySpy,
      getTrustAdminIsAuthenticated: jest
        .fn()
        .mockReturnValue((cookie) => cookie === "token=valid.token.value"),
    };
  });

  it("returns 405 if not POST method", async () => {
    // Arrange
    validRequest.method = "GET";
    // Act
    await createFacility(validRequest, response, {
      container,
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 401 if no token provided", async () => {
    // Arrange
    const trustAdminIsAuthenticatedSpy = jest.fn().mockReturnValue(false);
    // Act
    await createFacility(
      {
        method: "POST",
        body: {},
        headers: {},
      },
      response,
      {
        container: {
          ...container,
          getTrustAdminIsAuthenticated: () => trustAdminIsAuthenticatedSpy,
        },
      }
    );
    // Assert
    expect(response.status).toHaveBeenCalledWith(401);
    expect(trustAdminIsAuthenticatedSpy).toHaveBeenCalled();
  });

  it("creates a new facility if valid", async () => {
    // Act
    await createFacility(validRequest, response, { container });
    // Assert
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ facilityId: 1 })
    );
    expect(createFacilitySpy).toHaveBeenCalledWith({
      name: "Yugi Muto Hospital",
      orgId: "1",
    });
  });

  it("returns a 400 status if errors", async () => {
    // Arrange
    const createFacilityStub = jest
      .fn()
      .mockReturnValue({ facilityId: 123, error: "Error message" });
    // Act
    await createFacility(validRequest, response, {
      container: {
        ...container,
        getCreateFacility: () => createFacilityStub,
      },
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
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
    await createFacility(invalidRequest, response, { container });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "name must be present" })
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
    await createFacility(invalidRequest, response, { container });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "name must be present" })
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
    await createFacility(invalidRequest, response, { container });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "name must be present" })
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
    await createFacility(invalidRequest, response, { container });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "organisation ID must be present" })
    );
  });
});
