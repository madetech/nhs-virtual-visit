import session from "../../../pages/api/session";

describe("api/session", () => {
  describe("Given incorrect method", () => {
    it("Returns a 405", async () => {
      let invalidRequest = { method: "GET", body: { code: "MEOW" } };
      let response = { statusCode: 0, end: jest.fn() };

      await session(invalidRequest, response, {});

      expect(response.statusCode).toEqual(405);
      expect(response.end).toHaveBeenCalled();
    });
  });

  describe("POST", () => {
    describe("Given an invalid code", () => {
      it("Returns a 401", async () => {
        const invalidRequest = {
          method: "POST",
          body: {
            code: "WOOF",
            pin: "1234"
          },
          headers: {
            "x-correlation-id": "correlationId",
          },
        };

        const response = { statusCode: 0, end: jest.fn() };
        const verifyWardCodeSpy = jest.fn(async () => ({
          validDepartmentCode: false,
        }));
        const verifyUserLoginSpy = jest.fn(async () => ({
          validUser: false,
        }));
        const container = {
          getRetrieveDepartmentByCode: () => verifyWardCodeSpy,
          getVerifyUserLogin: () => verifyUserLoginSpy,
        };

        await session(invalidRequest, response, { container });

        expect(verifyWardCodeSpy).toHaveBeenCalledWith("WOOF", "1234");
        expect(response.statusCode).toEqual(401);
        expect(response.end).toHaveBeenCalled();
      });
    });

    describe("Given a valid code", () => {
      it("Returns the generated token and sessionId in the response", async () => {
        const validRequest = {
          method: "POST",
          body: {
            code: "MEOW",
            pin: "1234"
          },
          headers: {
            "x-correlation-id": "correlationId",
          },
        };

        const response = {
          writeHead: jest.fn(),
          end: jest.fn(),
        };

        const verifyWardCodeSpy = jest.fn(async () => ({
          validWardCode: true,
          department: { wardId: 10, code: "MEOW", trustId: 1 },
        }));
        const verifyUserLoginSpy = jest.fn(async () => ({
          validUser: false,
        }));
        const tokenGeneratorSpy = jest.fn(() => "generatedToken");

        const container = {
          getTokenProvider: jest.fn(() => ({
            generate: tokenGeneratorSpy,
          })),
          getRetrieveDepartmentByCode: () => verifyWardCodeSpy,
          getVerifyUserLogin: () => verifyUserLoginSpy,
        };

        await session(validRequest, response, { container });

        expect(verifyWardCodeSpy).toHaveBeenCalledWith("MEOW", "1234");
        expect(tokenGeneratorSpy).toHaveBeenCalledWith({
          userId: undefined,
          wardId: 10,
          wardCode: "MEOW",
          trustId: 1,
          type: "wardStaff",
        });
        expect(response.writeHead).toHaveBeenCalledWith(
          201,
          expect.objectContaining({
            "Set-Cookie": [
              expect.stringContaining("generatedToken"),
              expect.stringContaining("sessionId"),
            ],
          })
        );
      });

      it.skip("logs a login event when a user has logged in", async () => {
        process.env.EVENT_LOGGING = true;

        const validRequest = {
          method: "POST",
          body: {
            code: "ward_code",
          },
          headers: {
            "x-correlation-id": "correlationId",
          },
        };
        const response = {
          writeHead: jest.fn(),
          end: jest.fn(),
        };

        const verifyWardCodeSpy = jest.fn(async () => ({
          validWardCode: true,
          department: { wardId: 10, code: "MEOW", trustId: 1 },
        }));

        const tokenGeneratorSpy = jest.fn(() => "generatedToken");

        const logEventSpy = jest.fn(async () => ({
          status: 201,
          body: "Created",
        }));

        const container = {
          getTokenProvider: jest.fn(() => ({
            generate: tokenGeneratorSpy,
          })),
          getRetrieveDepartmentByCode: () => verifyWardCodeSpy,
          getVerifyUserLogin: () => () =>
            jest.fn().mockReturnValue({ validUser: false }),
          getLogEventGateway: () => logEventSpy,
        };
        await session(validRequest, response, { container });

        expect(logEventSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            sessionId: expect.stringContaining("-"),
            correlationId: "correlationId",
            createdOn: expect.anything(),
            streamName: `ward-${10}`,
            trustId: 1,
            eventType: "logged-in-ward-staff",
            event: {
              wardId: 10,
            },
          })
        );
      });

      it("does not logs a login event when the event logging feature flag is false", async () => {
        process.env.EVENT_LOGGING = false;

        const validRequest = {
          method: "POST",
          body: {
            code: "ward_code",
          },
          headers: {
            "x-correlation-id": "correlationId",
          },
        };
        const response = {
          writeHead: jest.fn(),
          end: jest.fn(),
        };

        const verifyWardCodeSpy = jest.fn(async () => ({
          validDepartmentCode: true,
          department: { wardId: 10, code: "MEOW", trustId: 1 },
        }));

        const tokenGeneratorSpy = jest.fn(() => "generatedToken");

        const logEventSpy = jest.fn(async () => ({
          status: 201,
          body: "Created",
        }));

        const container = {
          getTokenProvider: jest.fn(() => ({
            generate: tokenGeneratorSpy,
          })),
          getRetrieveDepartmentByCode: () => verifyWardCodeSpy,
          getVerifyUserLogin: () => () =>
            jest.fn().mockReturnValue({ validUser: false }),
          getLogEventGateway: () => logEventSpy,
        };
        await session(validRequest, response, { container });

        expect(logEventSpy).toHaveBeenCalledTimes(0);
      });
    });

    describe("Given a valid trust admin code", () => {
      it("Returns the generated token and sessionId in the response", async () => {
        const validRequest = {
          method: "POST",
          body: {
            code: "trust_admin_code",
            password: "trust_admin_password",
          },
          headers: {
            "x-correlation-id": "correlationId",
          },
        };

        const response = {
          writeHead: jest.fn(),
          end: jest.fn(),
        };

        const verifyWardCodeSpy = jest.fn(async () => ({
          validDepartmentCode: false,
          department: {},
        }));

        const verifyUserLoginSpy = jest.fn(async () => ({
          validUser: true,
          trust_id: 1,
          type: "manager",
          error: null,
        }));

        const tokenGeneratorSpy = jest.fn(() => "generatedToken");

        const container = {
          getTokenProvider: jest.fn(() => ({
            generate: tokenGeneratorSpy,
          })),
          getRetrieveDepartmentByCode: () => verifyWardCodeSpy,
          getVerifyUserLogin: () => verifyUserLoginSpy,
        };

        await session(validRequest, response, { container });

        expect(verifyUserLoginSpy).toHaveBeenCalledWith(
          "trust_admin_code",
          "trust_admin_password"
        );
        expect(tokenGeneratorSpy).toHaveBeenCalledWith({
          wardId: undefined,
          wardCode: undefined,
          trustId: 1,
          type: "trustAdmin",
        });
        expect(response.writeHead).toHaveBeenCalledWith(
          201,
          expect.objectContaining({
            "Set-Cookie": [
              expect.stringContaining("generatedToken"),
              expect.stringContaining("sessionId"),
            ],
          })
        );
      });
    });

    describe("Given a valid admin code", () => {
      it("Returns the generated token and sessionId in the response", async () => {
        const validRequest = {
          method: "POST",
          body: {
            code: "admin_code",
            password: "password",
          },
          headers: {
            "x-correlation-id": "correlationId",
          },
        };

        const response = {
          writeHead: jest.fn(),
          end: jest.fn(),
        };

        const verifyUserLoginSpy = jest
          .fn()
          .mockReturnValue({ validUser: true, type: "admin" });

        const tokenGeneratorSpy = jest.fn(() => "generatedToken");

        const container = {
          getTokenProvider: jest.fn(() => ({
            generate: tokenGeneratorSpy,
          })),
          getRetrieveDepartmentByCode: () =>
            jest.fn(async () => ({
              validDepartmentCode: false,
            })),
          getVerifyUserLogin: () => verifyUserLoginSpy,
        };

        await session(validRequest, response, { container });

        expect(verifyUserLoginSpy).toHaveBeenCalledWith(
          "admin_code",
          "password"
        );
        expect(tokenGeneratorSpy).toHaveBeenCalledWith({
          wardId: undefined,
          wardCode: undefined,
          trustId: undefined,
          type: "admin",
        });
        expect(response.writeHead).toHaveBeenCalledWith(
          201,
          expect.objectContaining({
            "Set-Cookie": [
              expect.stringContaining("generatedToken"),
              expect.stringContaining("sessionId"),
            ],
          })
        );
      });
    });
  });

  describe("DELETE", () => {
    describe("Given a logged in user", () => {
      it("Clears the token and expires the cookie", () => {
        const container = {};

        let response = {
          writeHead: jest.fn(),
          end: jest.fn(),
        };

        session({ method: "DELETE", body: {} }, response, { container });

        expect(response.writeHead).toHaveBeenCalledWith(
          201,
          expect.objectContaining({
            "Set-Cookie": [
              `token=''; httpOnly; path=/; expires=${new Date(0)}`,
              `sessionId=''; httpOnly; path=/; expires=${new Date(0)}`,
            ],
          })
        );
      });
    });
  });
});
