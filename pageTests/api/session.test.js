import session from "../../pages/api/session";

describe("api/session", () => {
  beforeEach(() => {
    process.env.ALLOWED_CODES = "MEOW";
  });

  afterEach(() => {
    process.env.ALLOWED_CODES = undefined;
  });

  describe("Given incorrect method", () => {
    it("Returns a 406", () => {
      let invalidRequest = { method: "GET", body: { code: "MEOW" } };
      let response = { statusCode: 0, end: jest.fn() };

      session(invalidRequest, response, {});

      expect(response.statusCode).toEqual(406);
      expect(response.end).toHaveBeenCalled();
    });
  });

  describe("Given an invalid code", () => {
    it("Returns a 401", () => {
      let invalidRequest = {
        method: "POST",
        body: {
          code: "WOOF",
        },
      };

      let response = { statusCode: 0, end: jest.fn() };
      session(invalidRequest, response, {});

      expect(response.statusCode).toEqual(401);
      expect(response.end).toHaveBeenCalled();
    });
  });

  describe("Given a valid code", () => {
    it("Returns the generated token in the response", () => {
      let validRequest = {
        method: "POST",
        body: {
          code: "MEOW",
        },
      };

      let response = {
        writeHead: jest.fn(),
        end: jest.fn(),
      };

      let container = {
        getTokenProvider: jest.fn(() => ({
          generate: jest.fn(() => "generatedToken"),
        })),
      };

      session(validRequest, response, { container });

      expect(response.writeHead).toHaveBeenCalledWith(
        201,
        expect.objectContaining({
          "Set-Cookie": expect.stringContaining("generatedToken"),
        })
      );
    });
  });
});
