import testSendSignUpEmail from "../../../pages/api/test-endpoints/test-send-sign-up-email";
import createTimeSensitiveLink from "../../../src/helpers/createTimeSensitiveLink";
import bcrypt from "bcryptjs";

jest.mock("../../../src/helpers/createTimeSensitiveLink");
jest.mock("bcryptjs");

describe("test-send-sign-up-email", () => {
  let validRequest, response, container;

  beforeEach(() => {
    process.env.APP_ENV = "test";
    validRequest = {
      method: "POST",
      body: {
        type: "activation"
      },
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
      getCreateManager: jest.fn().mockReturnValue(() => {
        return {
          user: {
            id: 1,
            email: "nhs-manager@nhs.uk",
            password: "hashedpassword",
            type: "manager",
            organisationId: 1,
            status: 0,
            uuid: "uuid",
          },
          error: null,
        };
      }),
      getAddToUserVerificationTable: jest.fn().mockReturnValue(() => {
        return {
          verifyUser: {
            hash: "hashedUuid",
          },
          error: null,
        };
      }),
      getRetrieveManagersByOrgId: jest.fn(),
    };
    createTimeSensitiveLink.mockReturnValue({
      link: "validLink",
      linkError: null,
    });
    bcrypt.hashSync.mockReturnValue("hashedPassword");
  });

  afterEach(() => {
    process.env.APP_ENV = "";
  });

  it("returns 403 if the endpoint isn't called from a test environment", async () => {
    process.env.APP_ENV = "production"

    await testSendSignUpEmail(validRequest, response, { container: container });

    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "Can't access this endpoint from a production environment" })
    );
  });

  it("returns 405 if not POST method", async () => {
    validRequest.method = "GET";

    await testSendSignUpEmail(validRequest, response, { container: container });

    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 400 if there is an error returned from createManager database call", async () => {
    const createManagerSpy = jest.fn().mockReturnValue({
      user: null,
      error: "There was an error",
    });

    await testSendSignUpEmail(validRequest, response, {
      container: {
        ...container,
        getCreateManager: () => createManagerSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ error: "There was an error" })
    );
  });

  describe("when organisation status is 0", () => {
    it("returns a 400 if there is an error returned from addToUserVerificationTable database call", async () => {
      const addToUserVerificationTableSpy = jest.fn().mockReturnValue({
        error: "There was a verificationError",
      });

      await testSendSignUpEmail(validRequest, response, {
        container: {
          ...container,
          getAddToUserVerificationTable: () => addToUserVerificationTableSpy,
        },
      });

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.end).toHaveBeenCalledWith(
        JSON.stringify({ error: "There was a verificationError" })
      );
    });

    it("returns a 401 if there is a linkError", async () => {
      createTimeSensitiveLink.mockReturnValue({
        link: "",
        linkError: "link error!",
      });

      await testSendSignUpEmail(validRequest, response, {
        container: {
          ...container,
        },
      });

      expect(response.status).toHaveBeenCalledWith(401);
      expect(response.end).toHaveBeenCalledWith(
        JSON.stringify({
          error: "There was an error creating link to sign up",
        })
      );
    });

    it("returns a 201 if the link is created successfully", async () => {

      await testSendSignUpEmail(validRequest, response, {container });

      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.end).toHaveBeenCalledWith(
        JSON.stringify({ link: "validLink" })
      );
    });
  });

  describe("when organisation status is 1", () => {
    beforeEach(() => {
      validRequest = {
        ...validRequest,
        body: {
          type: "authorisation"
          },
        },
      container = {
        ...container,
        getRetrieveManagersByOrgId: jest.fn().mockReturnValue(() => {
          return {
            managers: [
              {
                id: 1,
                uuid: "manager1Uuid",
                email: "nhs-manager1@nhs.co.uk",
              },
              {
                id: 2,
                uuid: "manager2Uuid",
                email: "nhs-manager2@nhs.co.uk",
              },
            ],
            error: null,
          };
        }),
      };
    });

    it("returns a 400 if there is an error returned from retrieveManagerByOrgId database call", async () => {
      const retrieveManagersByOrgIdSpy = jest.fn().mockReturnValue({
        managers: null,
        error: "There was an error",
      });

      await testSendSignUpEmail(validRequest, response, {
        container: {
          ...container,
          getRetrieveManagersByOrgId: () => retrieveManagersByOrgIdSpy,
        },
      });

      expect(response.status).toHaveBeenCalledWith(400);
      expect(response.end).toHaveBeenCalledWith(
        JSON.stringify({ error: "There was an error" })
      );
    });

    it("returns a 201 if the link is created successfully for manager authorisation", async () => {
      const addToUserVerificationTableSpy = jest.fn().mockReturnValue({
        verifyUser: { hash: "hashedUuid" },
        error: null,
      });
      await testSendSignUpEmail(validRequest, response, {
        container: {
          ...container,
          getAddToUserVerificationTable: () => addToUserVerificationTableSpy,
        },
      });

      const managerId = 1;

      expect(response.status).toHaveBeenCalledWith(201);
      expect(response.end).toHaveBeenCalledWith(
        JSON.stringify({ link: "validLink" })
      );

      expect(addToUserVerificationTableSpy).toHaveBeenCalledWith({
        user_id: managerId,
        type: "authoriseUser",
      });

      expect(createTimeSensitiveLink).toHaveBeenCalledWith({
        headers: { cookie: "" },
        uuid: "uuid",
        hash: "hashedUuid",
        expirationTime: "48h",
        urlPath: "authorise-user",
      });
    });

    it("returns a 500 if use case call throws an error", async () => {
      // Arrange
      const retrieveManagersByOrgIdSpy = jest.fn(async () => {
        throw new Error("ERROR!");
      });
      // Act
      await testSendSignUpEmail(validRequest, response, {
        container: {
          ...container,
          getRetrieveManagersByOrgId: () => retrieveManagersByOrgIdSpy,
        },
      });

      // Assert
      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.end).toHaveBeenCalledWith(
        JSON.stringify({
          error: "Internal server error occurred",
        })
      );
    });
  });
});