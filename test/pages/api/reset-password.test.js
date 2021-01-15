import resetPassword from "../../../pages/api/reset-password";

describe("reset-password", () => {
  let validRequest, response, container;

  beforeEach(() => {
    validRequest = {
      method: "POST",
      body: {
        email: "nhs-manager@nhs.co.uk",
        password: "password",
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
      getResetPassword: jest.fn().mockReturnValue(() => {
        return { resetSuccess: true, error: null };
      }),
    };
  });

  it("returns 405 if not POST method", async () => {
    validRequest.method = "GET";

    await resetPassword(validRequest, response, {
      container: container,
    });

    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("resets the password for the given email address account", async () => {
    const createResetPasswordSpy = jest
      .fn()
      .mockReturnValue({ resetSuccess: true, error: null });

    await resetPassword(validRequest, response, {
      container: {
        ...container,
        getResetPassword: () => createResetPasswordSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ resetSuccess: true })
    );
    expect(createResetPasswordSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        email: "nhs-manager@nhs.co.uk",
        password: "password",
      })
    );
  });

  it("returns a 400 if the email is not present", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        email: "",
        password: "password",
      },
      headers: {
        cookie: "",
      },
    };

    await resetPassword(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "email must be present" })
    );
  });

  it("returns a 400 if the password is not present", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        email: "nhs-manager@nhs.co.uk",
        password: "",
      },
      headers: {
        cookie: "",
      },
    };

    await resetPassword(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "password must be present" })
    );
  });

  it("returns a 400 status if errors", async () => {
    const resetPasswordStub = jest
      .fn()
      .mockReturnValue({ resetSuccess: false, error: "Error message" });

    await resetPassword(validRequest, response, {
      container: {
        ...container,
        getResetPassword: () => resetPasswordStub,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "error resetting password" })
    );
  });
});
