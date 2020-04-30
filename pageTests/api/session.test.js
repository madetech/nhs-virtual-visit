import session from "../../pages/api/session";

describe("api/session", () => {
  beforeEach(() => {
    process.env.ADMIN_AUTH_CODES = "admin_code";
  });

  afterEach(() => {
    process.env.ADMIN_AUTH_CODES = undefined;
  });

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
        const container = {
          getVerifyWardCode: () => verifyWardCodeSpy,
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
          ward: { id: 10, code: "MEOW" },
        }));
        const tokenGeneratorSpy = jest.fn(() => "generatedToken");

        const container = {
          getTokenProvider: jest.fn(() => ({
            generate: tokenGeneratorSpy,
          })),
          getVerifyWardCode: () => verifyWardCodeSpy,
        };

        await session(validRequest, response, { container });

        expect(verifyWardCodeSpy).toHaveBeenCalledWith("MEOW");
        expect(tokenGeneratorSpy).toHaveBeenCalledWith({
          wardId: 10,
          wardCode: "MEOW",
          admin: false,
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

        const verifyWardCodeSpy = jest.fn(async () => ({
          validWardCode: false,
          ward: {},
        }));
        const tokenGeneratorSpy = jest.fn(() => "generatedToken");

        const container = {
          getTokenProvider: jest.fn(() => ({
            generate: tokenGeneratorSpy,
          })),
          getVerifyWardCode: () => verifyWardCodeSpy,
        };

        await session(validRequest, response, { container });

        expect(tokenGeneratorSpy).toHaveBeenCalledWith({
          wardId: undefined,
          wardCode: undefined,
          admin: true,
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
