import testSendResetPasswordEmail from "../../../pages/api/test-endpoints/test-send-reset-password-email";
import createTimeSensitiveLink from "../../../src/helpers/createTimeSensitiveLink";

jest.mock("../../../src/helpers/createTimeSensitiveLink");

describe("sendTestEmail", () => {
  let validRequest, response, container;

  beforeEach(() => {
    process.env.APP_ENV = "test";
    
    validRequest = {
      method: "POST",
      headers: {
        cookie: "",
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
      getAddToUserVerificationTable: jest.fn().mockReturnValue(() => {
        return {
          verifyUser: { hash: "hashedUuid" },
          error: null,
        };
      }),
      getRetrieveManagerByEmail: jest.fn().mockReturnValue(() => {
        return {
          manager: {
            email: "nhs-admin@nhs.co.uk",
            uuid: "uuid",
          },
          error: null,
        };
      }),
    };
    createTimeSensitiveLink.mockReturnValue({
      link: "validLink",
      linkError: null,
    });
  });

  afterEach(() => {
    process.env.APP_ENV = "";
  });

  it("returns 403 if the endpoint isn't called from a test environment", async () => {
    process.env.APP_ENV = "production"

    await testSendResetPasswordEmail(validRequest, response, { container: container });

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "Can't access this endpoint from a production environment" })
    );
  });
  it("returns 405 if not POST method", async () => {
    validRequest.method = "GET";

    await testSendResetPasswordEmail(validRequest, response, {
      container: container,
    });

    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 400 if there is an error returned from retrieveManagerByEmail", async () => {
    const getRetrieveManagerByEmailSpy = jest.fn().mockReturnValue({
      manager: {
        email: "nhs-admin13@nhs.co.uk",
        uuid: "uuid",
        id: 1,
      },
      error: "Email could not be found in database",
    });

    await testSendResetPasswordEmail(validRequest, response, {
      container: {
        ...container,
        getRetrieveManagerByEmail: () =>
        getRetrieveManagerByEmailSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "Email does not exist" })
    );
  });

  it("returns a 400 if there is no manager is returned from database call", async () => {
    const getRetrieveManagerByEmailSpy = jest.fn().mockReturnValue({
      manager: null,
      error: null,
    });

    await testSendResetPasswordEmail(validRequest, response, {
      container: {
        ...container,
        getRetrieveManagerByEmail: () =>
          getRetrieveManagerByEmailSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "Email does not exist" })
    );
  });

  it("returns a 400 if there is an error returned from addToUserVerificationTable", async () => {
    const getAddToUserVerificationTableSpy = jest.fn().mockReturnValue({
      verifyUser: { hash: "" },
      error: "There was a verification error",
    });

    await testSendResetPasswordEmail(validRequest, response, {
      container: {
        ...container,
        getAddToUserVerificationTable: () =>
        getAddToUserVerificationTableSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "There was a verification error" })
    );
  });

  it("returns a 201 if the link is created successfully", async () => {

    await testSendResetPasswordEmail(validRequest, response, { container });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ link: "validLink" })
    );
  });

  it("returns a 401 if there is a linkError", async () => {
    createTimeSensitiveLink.mockReturnValue({
      link: "",
      linkError: "link error!",
    });

    await testSendResetPasswordEmail(validRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        error: "There was an error creating link to reset password",
      })
    );
  });
});