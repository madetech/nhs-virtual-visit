import createDepartment from "../../../pages/api/create-department";
import mockAppContainer from "src/containers/AppContainer";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";

describe("create-department", () => {
  const expectedUuid = "department uuid";
  const departmentObj = {
    name: "Seto Kaiba Department",
    code: "YamiYugi",
    pin: "1234",
    facilityId: 1,
  };
  const createDepartmentSpy = jest.fn(() =>
    Promise.resolve({ uuid: expectedUuid, error: null })
  );
  let validRequest, response;
  beforeEach(() => {
    validRequest = {
      method: "POST",
      body: departmentObj,
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
    mockAppContainer.getCreateDepartment.mockImplementation(
      () => createDepartmentSpy
    );
  });

  it("returns 405 if not POST method", async () => {
    // Arrange
    validRequest.method = "GET";
    // Act
    await createDepartment(validRequest, response, {
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
    await createDepartment(
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

  it("creates a new department if valid", async () => {
    await createDepartment(validRequest, response, {
      container: mockAppContainer,
    });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ uuid: expectedUuid })
    );
    expect(createDepartmentSpy).toHaveBeenCalledWith({
      ...departmentObj,
      createdBy: 10,
    });
  });

  it("returns a 400 status if errors", async () => {
    const createDepartmentStub = jest
      .fn()
      .mockReturnValue({ uuid: expectedUuid, error: "Error message" });
    mockAppContainer.getCreateDepartment.mockImplementationOnce(
      () => createDepartmentStub
    );

    await createDepartment(validRequest, response, {
      container: mockAppContainer,
    });

    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("returns a 400 if the name is an empty string", async () => {
    const invalidRequest = {
      method: "POST",
      body: { ...departmentObj, name: "" },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createDepartment(invalidRequest, response, {
      container: mockAppContainer,
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "name must be present" })
    );
  });

  it("returns a 400 if the name is not provided", async () => {
    const invalidRequest = {
      method: "POST",
      body: { ...departmentObj, name: undefined },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createDepartment(invalidRequest, response, {
      container: mockAppContainer,
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "name must be present" })
    );
  });

  it("returns a 400 if a facility id is not present", async () => {
    const invalidRequest = {
      method: "POST",
      body: { ...departmentObj, facilityId: undefined },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createDepartment(invalidRequest, response, {
      container: mockAppContainer,
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "facility id must be present" })
    );
  });
  it("returns a 400 if a department pin is not present", async () => {
    const invalidRequest = {
      method: "POST",
      body: { ...departmentObj, pin: undefined },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createDepartment(invalidRequest, response, {
      container: mockAppContainer,
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "department pin must be present" })
    );
  });
  it("returns a 400 if a department code is not present", async () => {
    const invalidRequest = {
      method: "POST",
      body: { ...departmentObj, code: undefined },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createDepartment(invalidRequest, response, {
      container: mockAppContainer,
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "department code must be present" })
    );
  });
  it("returns a 500 if appContainer call throws an error", async () => {
    // Arrange
    mockAppContainer.getCreateDepartment.mockImplementationOnce(() =>
      jest.fn(async () => {
        throw new Error("ERROR!");
      })
    );
    // Act
    await createDepartment(validRequest, response, {
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
