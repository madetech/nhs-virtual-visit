import bookAVisit from "../../pages/api/book-a-visit";
import fetch from "node-fetch";
import moment from "moment";

jest.mock("node-fetch");
fetch.mockReturnValue({
  json: () => ({ roomUrl: "http://meow.cat/fakeUrl" }),
});

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
        patientName: "Bob Smith",
        contactNumber: "07123456789",
        contactEmail: "bob@example.com",
        contactName: "John Smith",
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
});
