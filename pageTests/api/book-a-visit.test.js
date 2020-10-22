import bookAVisit from "../../pages/api/book-a-visit";
import moment from "moment";
import {
  createVisit,
  retrieveWardById,
  retrieveTrustById,
  CallIdProvider,
  RandomIdProvider,
} from "../../src/containers/CreateVisitContainer";
import sendBookingNotification from "../../src/usecases/sendBookingNotification";
import createVisitUnitOfWork from "../../src/gateways/UnitsOfWork/createVisitUnitOfWork";

jest.mock("../../src/containers/CreateVisitContainer", () => ({
  createVisit: jest.fn(),
  retrieveTrustById: jest.fn(),
  retrieveWardById: jest.fn(),
  CallIdProvider: jest.fn(),
  RandomIdProvider: jest.fn(),
}));
jest.mock("../../src/usecases/sendTextMessage", () => jest.fn());
jest.mock("../../src/usecases/sendEmail", () => jest.fn());
jest.mock("../../src/usecases/sendBookingNotification", () => jest.fn());
jest.mock("../../src/gateways/UnitsOfWork/createVisitUnitOfWork", () =>
  jest.fn()
);
jest.mock("../../src/gateways/GovNotify", () => jest.fn());

const frozenTime = moment();

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
    const ward = { id: 10, name: "wardName", hospitalName: "hospitalName" };
    retrieveTrustById.mockImplementation(() => {
      return { trust, error: "" };
    });
    retrieveWardById.mockImplementation(() => {
      return { ward, error: "" };
    });

    const createVisitSpy = jest
      .fn()
      .mockResolvedValue({ success: true, err: "" });
    createVisit.mockReturnValue(createVisitSpy);

    RandomIdProvider.mockImplementation(() => {
      return { generate: jest.fn().mockReturnValue("callPassword") };
    });
    CallIdProvider.mockImplementation(() => {
      return { generate: jest.fn().mockReturnValue("callId") };
    });

    await bookAVisit(request, response, { container });

    const expectedVisit = {
      patientName: "Patient Name",
      contactEmail: "contact@test.com",
      contactNumber: "07123456789",
      contactName: "Contact Name",
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

  it("sets up unitOfWork and createVisit correctly", async () => {
    const sendBookingNotificationDouble = jest.fn();
    sendBookingNotification.mockReturnValue(sendBookingNotificationDouble);
    const createVisitUnitOfWorkDouble = jest.fn();
    createVisitUnitOfWork.mockReturnValue(createVisitUnitOfWorkDouble);

    await bookAVisit(request, response, { container });

    expect(createVisitUnitOfWork).toHaveBeenCalledWith(
      sendBookingNotificationDouble
    );
    expect(createVisit).toHaveBeenCalledWith(createVisitUnitOfWorkDouble);
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

  it("returns a 400 when createVisit returns an error", async () => {
    const trust = { id: 1, videoProvider: "anotherTestVideoProvider" };
    const ward = {
      id: 10,
      name: "anotherWardName",
      hospitalName: "anotherHospitalName",
    };
    retrieveTrustById.mockImplementation(() => {
      return { trust, error: "" };
    });
    retrieveWardById.mockImplementation(() => {
      return { ward, error: "" };
    });

    const createVisitSpy = jest
      .fn()
      .mockResolvedValue({ success: false, err: "Some error!" });
    createVisit.mockReturnValue(createVisitSpy);

    RandomIdProvider.mockImplementation(() => {
      return { generate: jest.fn().mockReturnValue("anotherCallPassword") };
    });
    CallIdProvider.mockImplementation(() => {
      return { generate: jest.fn().mockReturnValue("anotherCallId") };
    });

    await bookAVisit(request, response, { container });

    const expectedVisit = {
      patientName: "Patient Name",
      contactEmail: "contact@test.com",
      contactNumber: "07123456789",
      contactName: "Contact Name",
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
    retrieveTrustById.mockImplementation(() => {
      return { trust, error: "" };
    });
    retrieveWardById.mockImplementation(() => {
      return { ward, error: "" };
    });

    const createVisitSpy = jest.fn().mockImplementation(() => {
      throw "Some error!";
    });
    createVisit.mockReturnValue(createVisitSpy);

    RandomIdProvider.mockImplementation(() => {
      return { generate: jest.fn().mockReturnValue("anotherCallPassword") };
    });
    CallIdProvider.mockImplementation(() => {
      return { generate: jest.fn().mockReturnValue("anotherCallId") };
    });

    await bookAVisit(request, response, { container });

    const expectedVisit = {
      patientName: "Patient Name",
      contactEmail: "contact@test.com",
      contactNumber: "07123456789",
      contactName: "Contact Name",
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
