import validateHttpMethod from "./apiErrorHandler";

describe("validateHttpMethod", () => {
  it("returns 405 if method is not allowed", () => {
    let response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    validateHttpMethod("POST", "GET", response);

    expect(response.status).toHaveBeenCalledWith(405);
    expect(response.end).toHaveBeenCalled;
  });

  it("does not end request", () => {
    let response = {
      status: jest.fn(),
      end: jest.fn(),
    };

    validateHttpMethod("POST", "POST", response);

    expect(response.status).toHaveBeenCalledTimes(0);
    expect(response.end).toHaveBeenCalledTimes(0);
  });
});
