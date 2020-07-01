import createHospital from "../../pages/api/create-hospital";

jest.mock("node-fetch");

describe("create-hospital", () => {
  let validRequest;
  let response;
  let container;

  beforeEach(() => {
    validRequest = {
      method: "POST",
      body: {
        name: "Yugi Muto Hospital",
        trustId: "1",
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
      getCreateHospital: jest.fn().mockReturnValue(() => {
        return { hospitalId: 1, error: null };
      }),
      getTrustAdminIsAuthenticated: jest
        .fn()
        .mockReturnValue((cookie) => cookie === "token=valid.token.value"),
    };
  });

  it("returns 405 if not POST method", async () => {
    validRequest.method = "GET";

    await createHospital(validRequest, response, {
      container: container,
    });

    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 401 if no token provided", async () => {
    const trustAdminIsAuthenticatedSpy = jest.fn().mockReturnValue(false);

    await createHospital(
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

    expect(response.status).toHaveBeenCalledWith(401);
    expect(trustAdminIsAuthenticatedSpy).toHaveBeenCalled();
  });

  it("creates a new hospital if valid", async () => {
    const createHospitalSpy = jest
      .fn()
      .mockReturnValue({ hospitalId: 123, error: null });

    await createHospital(validRequest, response, {
      container: {
        ...container,
        getCreateHospital: () => createHospitalSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ hospitalId: 123 })
    );
    expect(createHospitalSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Yugi Muto Hospital",
        trustId: "1",
      })
    );
  });

  it("creates a new hospital with a support url if valid", async () => {
    const createHospitalSpy = jest
      .fn()
      .mockReturnValue({ hospitalId: 123, error: null });

    validRequest.body = {
      name: "Yugi Muto Hospital",
      trustId: "1",
      supportUrl: "https://www.support.example.com",
    };

    await createHospital(validRequest, response, {
      container: {
        ...container,
        getCreateHospital: () => createHospitalSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ hospitalId: 123 })
    );
    expect(createHospitalSpy).toHaveBeenCalledWith({
      name: "Yugi Muto Hospital",
      trustId: "1",
      supportUrl: "https://www.support.example.com",
    });
  });

  it("returns a 400 status if errors", async () => {
    const createHospitalStub = jest
      .fn()
      .mockReturnValue({ hospitalId: 123, error: "Error message" });

    await createHospital(validRequest, response, {
      container: {
        ...container,
        getCreateHospital: () => createHospitalStub,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("returns a 400 if the name is an empty string", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        name: "",
        hospitalName: "Yugi Muto Hospital",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createHospital(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "name must be present" })
    );
  });

  it("returns a 400 if the name is not provided", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        hospitalName: "Yugi Muto Hospital",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createHospital(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "name must be present" })
    );
  });

  it("returns a 400 if the hospital name is an empty string", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        name: "",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createHospital(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "name must be present" })
    );
  });

  it("returns a 400 if the trust ID is not provided", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        name: "Seto Kaiba Ward",
      },
      headers: {
        cookie: "token=valid.token.value",
      },
    };

    await createHospital(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "trust ID must be present" })
    );
  });
});
