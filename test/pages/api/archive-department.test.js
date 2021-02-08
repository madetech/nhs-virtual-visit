import archiveDepartment from "../../../pages/api/archive-department";
import mockAppContainer from "src/containers/AppContainer";
import { TRUST_ADMIN } from "../../../src/helpers/userTypes";

describe("archive-department", () => {
  const expectedUuid = "department-uuid";
  const idToArchive = 10;
  const expectedBodyObj = { uuid: expectedUuid };
  const expectedDepartmentObj = { id: idToArchive };
  const retrieveDepartmentByUuidSpy = jest
    .fn()
    .mockResolvedValue({ department: expectedDepartmentObj });
  let validRequest, response;
  beforeEach(() => {
    validRequest = {
      method: "DELETE",
      body: { uuid: expectedUuid },
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
    mockAppContainer.getRetrieveDepartmentByUuid.mockImplementation(
      () => retrieveDepartmentByUuidSpy
    );
  });

  it("returns 405 if not DELETE method", async () => {
    // Arrange
    validRequest.method = "GET";
    // Act
    await archiveDepartment(validRequest, response, {
      container: mockAppContainer,
    });
    // Assert
    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 401 if not a trust admin", async () => {
    // Arrange
    const trustAdminIsAuthenticatedSpy = jest.fn().mockReturnValue(false);
    mockAppContainer.getOrganisationAdminIsAuthenticated.mockImplementationOnce(
      () => trustAdminIsAuthenticatedSpy
    );
    await archiveDepartment(
      {
        method: "DELETE",
        body: {},
        headers: {},
      },
      response,
      {
        container: mockAppContainer,
      }
    );

    expect(response.status).toHaveBeenCalledWith(401);
    expect(trustAdminIsAuthenticatedSpy).toHaveBeenCalled();
  });

  it("archives a department if valid", async () => {
    const archiveDepartmentSpy = jest
      .fn()
      .mockResolvedValue({ uuid: expectedUuid, error: null });
    mockAppContainer.getArchiveDepartmentById.mockImplementation(
      () => archiveDepartmentSpy
    );
    await archiveDepartment(validRequest, response, {
      container: mockAppContainer,
    });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ uuid: expectedUuid })
    );
    expect(archiveDepartmentSpy).toHaveBeenCalledWith(idToArchive);
  });

  it("returns a 404 status if the department to be archived does not exist", async () => {
    const retrieveDepartmentStub = jest.fn().mockResolvedValue({
      department: null,
      error: "Error on retrieving department",
    });
    mockAppContainer.getRetrieveDepartmentByUuid.mockImplementationOnce(
      () => retrieveDepartmentStub
    );
    await archiveDepartment(validRequest, response, {
      container: mockAppContainer,
    });

    expect(response.status).toHaveBeenCalledWith(404);
  });
  it("returns a 400 status there is an error archiving the department", async () => {
    const archiveDepartmentSpy = jest
      .fn()
      .mockResolvedValue({ uuid: null, error: "Error on deleting department" });
    mockAppContainer.getArchiveDepartmentById.mockImplementationOnce(
      () => archiveDepartmentSpy
    );
    await archiveDepartment(validRequest, response, {
      container: mockAppContainer,
    });
    expect(archiveDepartmentSpy).toHaveBeenCalledWith(idToArchive);
    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("returns a 400 if the uuid is an empty string", async () => {
    const invalidRequest = {
      method: "DELETE",
      body: { ...expectedBodyObj, uuid: "" },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await archiveDepartment(invalidRequest, response, {
      container: mockAppContainer,
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "department uuid must be present" })
    );
  });
  it("returns a 500 if appContainer call throws an error", async () => {
    // Arrange
    mockAppContainer.getArchiveDepartmentById.mockImplementationOnce(() =>
      jest.fn(async () => {
        throw new Error("ERROR!");
      })
    );
    // Act
    await archiveDepartment(validRequest, response, {
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
