import updateADepartment from "../../../pages/api/update-a-department";
import mockAppContainer from "src/containers/AppContainer";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";
describe("update-a-ward", () => {
  let validRequest, response;
  beforeEach(() => {
    validRequest = {
      method: "PATCH",
      body: {
        uuid: "uuid",
        name: "Joey Wheeler Ward",
      },
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
    mockAppContainer.getRetrieveDepartmentByUuid.mockImplementation(() =>
      jest.fn(() =>
        Promise.resolve({
          department: { id: 1 },
          error: null,
        })
      )
    );
  });

  it("returns 405 if not PATCH method", async () => {
    // Arrange
    validRequest.method = "GET";
    // Act
    await updateADepartment(validRequest, response, {
      container: mockAppContainer,
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 401 if no token provided", async () => {
    // Arrange
    const trustAdminIsAuthenticatedSpy = jest.fn(() => false);
    mockAppContainer.getOrganisationAdminIsAuthenticated.mockImplementationOnce(
      () => trustAdminIsAuthenticatedSpy
    );
    // Act
    await updateADepartment(
      {
        method: "PATCH",
        body: {},
        headers: {},
      },
      response,
      { container: { ...mockAppContainer } }
    );
    // Assert
    expect(response.status).toHaveBeenCalledWith(401);
    expect(trustAdminIsAuthenticatedSpy).toHaveBeenCalled();
  });

  it("updates a department if valid", async () => {
    // Arrange
    const updateDepartmentSpy = jest.fn(() =>
      Promise.resolve({ uuid: "uuid", error: null })
    );

    mockAppContainer.getUpdateDepartmentById.mockImplementationOnce(
      () => updateDepartmentSpy
    );
    // Act
    await updateADepartment(validRequest, response, {
      container: { ...mockAppContainer },
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.end).toHaveBeenCalledWith(JSON.stringify({ uuid: "uuid" }));
    expect(updateDepartmentSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 1,
        name: "Joey Wheeler Ward",
      })
    );
  });

  it("returns a 400 status if errors", async () => {
    // Arrange
    const updateDepartmentStub = jest
      .fn()
      .mockReturnValue({ uuid: null, error: "Error message" });
    mockAppContainer.getUpdateDepartmentById.mockImplementationOnce(
      () => updateDepartmentStub
    );
    // Act
    await updateADepartment(validRequest, response, {
      container: {
        ...mockAppContainer,
      },
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "Error message" })
    );
  });

  it("returns a 400 status if body is not provided", async () => {
    // Act
    await updateADepartment(
      {
        method: "PATCH",
        headers: {
          cookie: "token=valid.token.value",
        },
      },
      response,
      {
        container: {
          ...mockAppContainer,
        },
      }
    );
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("returns a 400 if uuid is not provided", async () => {
    // Arrange
    const invalidRequest = {
      method: "PATCH",
      body: {
        name: "Joey Wheeler Ward",
        hospitalName: "Tristan Taylor Hospital",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    // Act
    await updateADepartment(invalidRequest, response, {
      container: {
        ...mockAppContainer,
      },
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "uuid and name must be present",
      })
    );
  });

  it("returns a 400 if id is an empty string", async () => {
    // Arrange
    const invalidRequest = {
      method: "PATCH",
      body: {
        id: "",
        name: "Joey Wheeler Ward",
        hospitalName: "Tristan Taylor Hospital",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    // Act
    await updateADepartment(invalidRequest, response, {
      container: {
        ...mockAppContainer,
      },
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "uuid and name must be present",
      })
    );
  });

  it("returns a 400 if name is not provided", async () => {
    // Arrange
    const invalidRequest = {
      method: "PATCH",
      body: {
        uuid: "uuid",
        hospitalName: "Tristan Taylor Hospital",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    // Act
    await updateADepartment(invalidRequest, response, {
      container: {
        ...mockAppContainer,
      },
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "uuid and name must be present",
      })
    );
  });

  it("returns a 400 if name is an empty string", async () => {
    // Arrange
    const invalidRequest = {
      method: "PATCH",
      body: {
        uuid: "uuid",
        name: "",
        hospitalName: "Tristan Taylor Hospital",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };
    // Act
    await updateADepartment(invalidRequest, response, {
      container: {
        ...mockAppContainer,
      },
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "uuid and name must be present",
      })
    );
  });

  it("returns a 400 if ward does not exist in current trust", async () => {
    // Arrange
    mockAppContainer.getRetrieveDepartmentByUuid.mockImplementationOnce(() =>
      jest.fn(() => ({ error: "Error!" }))
    );
    // Act
    await updateADepartment(validRequest, response, {
      container: {
        ...mockAppContainer,
      },
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "department does not exist in current trust" })
    );
  });

  it("returns a 500 if appContainer call throws an error", async () => {
    // Arrange
    mockAppContainer.getUpdateDepartmentById.mockImplementationOnce(() =>
      jest.fn(async () => {
        throw new Error("ERROR!");
      })
    );
    // Act
    await updateADepartment(validRequest, response, {
      container: {
        ...mockAppContainer,
      },
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
