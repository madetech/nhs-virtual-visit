import session from "../../pages/api/session";

describe("api/session", () => {
  describe("Given incorrect method", () => {
    it("Returns a 406", async () => {
      let invalidRequest = { method: "GET", body: { code: "MEOW" } };
      let response = { statusCode: 0, end: jest.fn() };

      await session(invalidRequest, response, {});

      expect(response.statusCode).toEqual(406);
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
          },
        };

        const response = { statusCode: 0, end: jest.fn() };
        const verifyWardCodeSpy = jest.fn(async () => ({
          validWardCode: false,
        }));
        const verifyTrustAdminCodeSpy = jest.fn(async () => ({
          validTrustAdminCode: false,
        }));
        const container = {
          getVerifyWardCode: () => verifyWardCodeSpy,
          getVerifyTrustAdminCode: () => verifyTrustAdminCodeSpy,
          getVerifyAdminCode: () =>
            jest.fn().mockReturnValue({ validAdminCode: false }),
        };

        await session(invalidRequest, response, { container });

        expect(verifyWardCodeSpy).toHaveBeenCalledWith("WOOF");
        expect(response.statusCode).toEqual(401);
        expect(response.end).toHaveBeenCalled();
      });
    });

    describe("Given a valid code", () => {
      it("Returns the generated token in the response", async () => {
        const validRequest = {
          method: "POST",
          body: {
            code: "MEOW",
          },
        };

        const response = {
          writeHead: jest.fn(),
          end: jest.fn(),
        };

        const verifyWardCodeSpy = jest.fn(async () => ({
          validWardCode: true,
          ward: { id: 10, code: "MEOW", trustId: 1 },
        }));
        const verifyTrustAdminCodeSpy = jest.fn(async () => ({
          validTrustAdminCode: false,
        }));
        const tokenGeneratorSpy = jest.fn(() => "generatedToken");

        const container = {
          getTokenProvider: jest.fn(() => ({
            generate: tokenGeneratorSpy,
          })),
          getVerifyWardCode: () => verifyWardCodeSpy,
          getVerifyTrustAdminCode: () => verifyTrustAdminCodeSpy,
          getVerifyAdminCode: () =>
            jest.fn().mockReturnValue({ validAdminCode: false }),
        };

        await session(validRequest, response, { container });

        expect(verifyWardCodeSpy).toHaveBeenCalledWith("MEOW");
        expect(tokenGeneratorSpy).toHaveBeenCalledWith({
          wardId: 10,
          wardCode: "MEOW",
          trustId: 1,
          type: "wardStaff",
        });
        expect(response.writeHead).toHaveBeenCalledWith(
          201,
          expect.objectContaining({
            "Set-Cookie": expect.stringContaining("generatedToken"),
          })
        );
      });
    });

    describe("Given a valid trust admin code", () => {
      it("Returns the generated token in the response", async () => {
        const validRequest = {
          method: "POST",
          body: {
            code: "trust_admin_code",
            password: "trust_admin_password",
          },
        };

        const response = {
          writeHead: jest.fn(),
          end: jest.fn(),
        };

        const verifyWardCodeSpy = jest.fn(async () => ({
          validWardCode: false,
          ward: {},
        }));

        const verifyTrustAdminCodeSpy = jest.fn(async () => ({
          validTrustAdminCode: true,
          trust: { id: 1 },
          error: null,
        }));

        const tokenGeneratorSpy = jest.fn(() => "generatedToken");

        const container = {
          getTokenProvider: jest.fn(() => ({
            generate: tokenGeneratorSpy,
          })),
          getVerifyWardCode: () => verifyWardCodeSpy,
          getVerifyTrustAdminCode: () => verifyTrustAdminCodeSpy,
          getVerifyAdminCode: () =>
            jest.fn().mockReturnValue({ validAdminCode: false }),
        };

        await session(validRequest, response, { container });

        expect(verifyTrustAdminCodeSpy).toHaveBeenCalledWith(
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
            "Set-Cookie": expect.stringContaining("generatedToken"),
          })
        );
      });
    });

    describe("Given a valid admin code", () => {
      it("Returns the generated token in the response", async () => {
        const validRequest = {
          method: "POST",
          body: {
            code: "admin_code",
          },
        };

        const response = {
          writeHead: jest.fn(),
          end: jest.fn(),
        };

        const verifyAdminCodeSpy = jest
          .fn()
          .mockReturnValue({ validAdminCode: true });

        const tokenGeneratorSpy = jest.fn(() => "generatedToken");

        const container = {
          getTokenProvider: jest.fn(() => ({
            generate: tokenGeneratorSpy,
          })),
          getVerifyWardCode: () =>
            jest.fn(async () => ({
              validWardCode: false,
            })),
          getVerifyTrustAdminCode: () =>
            jest.fn(async () => ({
              validTrustAdminCode: false,
            })),
          getVerifyAdminCode: () => verifyAdminCodeSpy,
        };

        await session(validRequest, response, { container });

        expect(verifyAdminCodeSpy).toHaveBeenCalledWith("admin_code");
        expect(tokenGeneratorSpy).toHaveBeenCalledWith({
          wardId: undefined,
          wardCode: undefined,
          trustId: undefined,
          type: "admin",
        });
        expect(response.writeHead).toHaveBeenCalledWith(
          201,
          expect.objectContaining({
            "Set-Cookie": expect.stringContaining("generatedToken"),
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
            "Set-Cookie": `token=''; httpOnly; path=/; expires=${new Date(0)}`,
          })
        );
      });
    });
  });
});
