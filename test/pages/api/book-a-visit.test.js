import bookAVisit from "../../../pages/api/book-a-visit";

const frozenTime = new Date();

describe("/api/book-a-visit", () => {
  let request;
  let response;
  let container;

  let date = new Date();
  date.setDate(date.getDate() + 1);

  const validUserIsAuthenticatedSpy = jest.fn().mockResolvedValue({
    wardId: 10,
    ward: "MEOW",
    trustId: 1,
  });

  beforeEach(() => {
    request = {
      method: "POST",
      body: {
        patientName: "Patient Name",
        contactNumber: "07123456789",
        contactEmail: "contact@test.com",
        contactName: "Contact Name",
        callTime: frozenTime,
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
    };

    container = {
      getUserIsAuthenticated: () => validUserIsAuthenticatedSpy,
    };
  });

  it("calls createVisit with the correct arguments", async () => {
    const trust = { id: 1, videoProvider: "testVideoProvider" };
    const ward = { id: 10, name: "wardName", trustId: 1 };

    const createVisitSpy = jest
      .fn()
      .mockResolvedValue({ success: true, err: "" });

    container.getCreateVisit = () => createVisitSpy;

    container.getRetrieveOrganisationById = () => () => ({
      organisation: trust,
      error: null,
    });

    container.getRetrieveDepartmentById = () => () => ({
      department: ward,
      error: null,
    });

    container.getRandomIdProvider = () => ({
      generate: () => "callPassword",
    });

    container.getCallIdProvider = () => ({
      generate: () => "callId",
    });

    await bookAVisit(request, response, { container });

    const expectedVisit = {
      patientName: "Patient Name",
      recipientEmail: "contact@test.com",
      recipientNumber: "07123456789",
      recipientName: "Contact Name",
      callTime: frozenTime,
    };

    expect(createVisitSpy).toHaveBeenCalledWith(
      expectedVisit,
      ward,
      "callId",
      "callPassword",
      trust.videoProvider
    );
    expect(response.status).toHaveBeenCalledWith(201);
  });

  it("returns a 401 when user is not authenticated", async () => {
    const userIsAuthenticatedSpy = jest.fn().mockResolvedValue(false);

    await bookAVisit(request, response, {
      container: {
        ...container,
        getUserIsAuthenticated: () => userIsAuthenticatedSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(401);
    expect(userIsAuthenticatedSpy).toHaveBeenCalled();
  });

  it("returns a 400 when no trust id", async () => {
    const userIsAuthenticatedSpy = jest.fn().mockResolvedValue({
      wardId: 10,
      ward: "MEOW",
      trustId: undefined,
    });

    await bookAVisit(request, response, {
      container: {
        ...container,
        getUserIsAuthenticated: () => userIsAuthenticatedSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(userIsAuthenticatedSpy).toHaveBeenCalled();
  });

  it("returns a 400 when no ward id", async () => {
    const userIsAuthenticatedSpy = jest.fn().mockResolvedValue({
      wardId: undefined,
      ward: "MEOW",
      trustId: 7,
    });

    await bookAVisit(request, response, {
      container: {
        ...container,
        getUserIsAuthenticated: () => userIsAuthenticatedSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(userIsAuthenticatedSpy).toHaveBeenCalled();
  });

  it("returns a 405 when method is not POST", async () => {
    request.method = "GET";

    const trust = { id: 1, videoProvider: "testVideoProvider" };
    const ward = { id: 10, name: "wardName", trustId: 1 };

    container.getRetrieveOrganisationById = () => () => ({
      organisation: trust,
      error: null,
    });

    container.getRetrieveDepartmentById = () => () => ({
      department: ward,
      error: null,
    });

    container.getRandomIdProvider = () => ({
      generate: () => "callPassword",
    });

    container.getCallIdProvider = () => ({
      generate: () => "callId",
    });

    await bookAVisit(request, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 400 when createVisit returns an error", async () => {
    const trust = { id: 1, videoProvider: "anotherTestVideoProvider" };
    const ward = {
      id: 10,
      name: "anotherWardName",
      hospitalName: "anotherHospitalName",
    };

    container.getRetrieveOrganisationById = () => () => ({
      organisation: trust,
      error: null,
    });

    container.getRetrieveDepartmentById = () => () => ({
      department: ward,
      error: null,
    });

    const createVisitSpy = jest
      .fn()
      .mockResolvedValue({ success: false, err: "Some error!" });

    container.getCreateVisit = () => createVisitSpy;

    container.getRandomIdProvider = () => ({
      generate: () => "anotherCallPassword",
    });

    container.getCallIdProvider = () => ({
      generate: () => "anotherCallId",
    });

    await bookAVisit(request, response, { container });

    const expectedVisit = {
      patientName: "Patient Name",
      recipientEmail: "contact@test.com",
      recipientNumber: "07123456789",
      recipientName: "Contact Name",
      callTime: frozenTime,
    };

    expect(createVisitSpy).toHaveBeenCalledWith(
      expectedVisit,
      ward,
      "anotherCallId",
      "anotherCallPassword",
      trust.videoProvider
    );
    expect(response.status).toHaveBeenCalledWith(400);
  });

  it("returns a 500 when createVisit throws error", async () => {
    const trust = { id: 1, videoProvider: "anotherTestVideoProvider" };
    const ward = {
      id: 10,
      name: "anotherWardName",
      hospitalName: "anotherHospitalName",
    };

    container.getRetrieveOrganisationById = () => () => ({
      organisation: trust,
      error: null,
    });

    container.getRetrieveDepartmentById = () => () => ({
      department: ward,
      error: null,
    });

    const createVisitSpy = jest.fn().mockImplementation(() => {
      throw "Some error!";
    });

    container.getCreateVisit = () => createVisitSpy;

    container.getRandomIdProvider = () => ({
      generate: () => "anotherCallPassword",
    });

    container.getCallIdProvider = () => ({
      generate: () => "anotherCallId",
    });

    await bookAVisit(request, response, { container });

    const expectedVisit = {
      patientName: "Patient Name",
      recipientEmail: "contact@test.com",
      recipientNumber: "07123456789",
      recipientName: "Contact Name",
      callTime: frozenTime,
    };

    expect(createVisitSpy).toHaveBeenCalledWith(
      expectedVisit,
      ward,
      "anotherCallId",
      "anotherCallPassword",
      trust.videoProvider
    );
    expect(response.status).toHaveBeenCalledWith(500);
  });
});
