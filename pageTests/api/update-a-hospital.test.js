import updateAHospital from "../../pages/api/update-a-hospital";

describe("update-a-hospital", () => {
  let validRequest;
  let response;
  let container;

  beforeEach(() => {
    validRequest = {
      method: "PATCH",
      body: {
        id: 123,
        name: "Hospital Name",
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
    container = {
      getUpdateHospital: jest.fn().mockReturnValue(() => {
        return { id: 123, error: null };
      }),
      getTrustAdminIsAuthenticated: jest
        .fn()
        .mockReturnValue((cookie) =>
          cookie === "token=valid.token.value" ? { trustId: 1 } : false
        ),
      getRetrieveHospitalById: jest.fn().mockReturnValue(() => {
        return { error: null };
      }),
      getTokenProvider: jest
        .fn()
        .mockReturnValue({ type: "trustAdmin", trustId: 1 }),
    };
  });

  it("returns 405 if not PATCH method", async () => {
    validRequest.method = "GET";

    await updateAHospital(validRequest, response, {
      container: container,
    });

    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 401 if no token provided", async () => {
    const trustAdminIsAuthenticatedSpy = jest.fn().mockReturnValue(false);

    await updateAHospital(
      {
        method: "PATCH",
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

    expect(response.status).toHaveBeenCalledWith(401);
    expect(trustAdminIsAuthenticatedSpy).toHaveBeenCalled();
  });

  it("returns a 400 status if body is not provided", async () => {
    await updateAHospital(
      {
        method: "PATCH",
        headers: {
          cookie: "token=valid.token.value",
        },
      },
      response,
      {
        container: {
          ...container,
        },
      }
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "hospital id and name must be present" })
    );
  });

  it("returns a 400 if id is not provided", async () => {
    const invalidRequest = {
      method: "PATCH",
      body: {
        name: "Hospital Name",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await updateAHospital(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "hospital id and name must be present" })
    );
  });

  it("returns a 400 if name is not provided", async () => {
    const invalidRequest = {
      method: "PATCH",
      body: {
        id: 123,
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await updateAHospital(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "hospital id and name must be present" })
    );
  });

  it("returns a 400 if id is an empty string", async () => {
    const invalidRequest = {
      method: "PATCH",
      body: {
        id: "",
        name: "Hospital Name",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await updateAHospital(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "hospital id and name must be present" })
    );
  });

  it("returns a 400 if name is an empty string", async () => {
    const invalidRequest = {
      method: "PATCH",
      body: {
        id: 123,
        name: "",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await updateAHospital(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "hospital id and name must be present" })
    );
  });

  it("returns a 404 if hospital does not exist", async () => {
    const retrieveHospitalByIdSpy = jest
      .fn()
      .mockReturnValue({ error: "Error!" });

    await updateAHospital(validRequest, response, {
      container: {
        ...container,
        getRetrieveHospitalById: () => retrieveHospitalByIdSpy,
      },
    });

    expect(retrieveHospitalByIdSpy).toHaveBeenCalledWith(123, 1);

    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "hospital does not exist in current trust" })
    );
  });

  it("updates hospital with new name from payload", async () => {
    const updateHospitalSpy = jest
      .fn()
      .mockReturnValue({ id: 123, error: null });

    await updateAHospital(validRequest, response, {
      container: { ...container, getUpdateHospital: () => updateHospitalSpy },
    });

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ hospitalId: 123 })
    );
    expect(updateHospitalSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 123,
        name: "Hospital Name",
      })
    );
  });

  it("returns a 500 if hospital fails to update", async () => {
    const updateHospitalSpy = jest.fn().mockReturnValue(() => {
      return { error: "Error!" };
    });

    container.getUpdateHospital = updateHospitalSpy;

    await updateAHospital(validRequest, response, { container });

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "failed to update hospital" })
    );
  });
});
