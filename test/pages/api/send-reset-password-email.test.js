import sendResetPasswordEmail from "../../../pages/api/send-reset-password-email";
import createTimeSensitiveLink from "../../../src/helpers/createTimeSensitiveLink";
import TemplateStore from "../../../src/gateways/GovNotify/TemplateStore";

jest.mock("../../../src/helpers/createTimeSensitiveLink");
jest.mock("../../../src/gateways/GovNotify/TemplateStore");

describe("send-reset-password-email", () => {
  let validRequest, response, container;

  beforeEach(() => {
    validRequest = {
      method: "POST",
      body: {
        email: "nhs-admin@nhs.co.uk",
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
      getRetrieveEmailAndHashedPassword: jest.fn().mockReturnValue(() => {
        return {
          emailAddress: "nhs-admin@nhs.co.uk",
          hashedPassword: "hashedPassword",
          error: null,
        };
      }),
      getSendEmail: jest.fn().mockReturnValue(() => {
        return { success: true, error: null };
      }),
    };
    createTimeSensitiveLink.mockReturnValue({
      link: "validLink",
      linkError: null,
    });
    TemplateStore.mockReturnValue({
      resetPasswordEmail: {
        templateId: "templateId",
        personalisationKeys: "validLink",
      },
    });
  });

  it("returns 405 if not POST method", async () => {
    validRequest.method = "GET";

    await sendResetPasswordEmail(validRequest, response, {
      container: container,
    });

    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 400 if the email is not present", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        email: "",
      },
      headers: {
        cookie: "",
      },
    };

    await sendResetPasswordEmail(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "email must be present" })
    );
  });

  it("returns a 400 if there is an error returned from database call", async () => {
    const getRetrieveEmailAndHashedPasswordSpy = jest.fn().mockReturnValue({
      email: "nhs-admin@nhs.co.uk",
      hashedPassword: "password",
      error: "Email could not be found in database",
    });

    await sendResetPasswordEmail(validRequest, response, {
      container: {
        ...container,
        getRetrieveEmailAndHashedPassword: () =>
          getRetrieveEmailAndHashedPasswordSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "Email does not exist" })
    );
  });

  it("returns a 400 if there is no email returned from database call", async () => {
    const getRetrieveEmailAndHashedPasswordSpy = jest.fn().mockReturnValue({
      email: "",
      hashedPassword: "password",
      error: null,
    });

    await sendResetPasswordEmail(validRequest, response, {
      container: {
        ...container,
        getRetrieveEmailAndHashedPassword: () =>
          getRetrieveEmailAndHashedPasswordSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "Email does not exist" })
    );
  });

  it("returns a 401 if there is a linkError", async () => {
    createTimeSensitiveLink.mockReturnValue({
      link: "",
      linkError: "link error!",
    });

    await sendResetPasswordEmail(validRequest, response, {
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

  it("returns a 201 if the sendEmail is successful", async () => {
    const getSendEmailSpy = jest
      .fn()
      .mockReturnValue({ success: true, error: null });

    await sendResetPasswordEmail(validRequest, response, {
      container: {
        ...container,
        getSendEmail: () => getSendEmailSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ success: true })
    );
    expect(getSendEmailSpy).toHaveBeenCalledWith(
      "templateId",
      "nhs-admin@nhs.co.uk",
      { link: "validLink" },
      null
    );
  });

  it("returns a 401 if the sendEmail is unsuccessful", async () => {
    const getSendEmailStub = jest
      .fn()
      .mockReturnValue({ success: false, error: "Error message" });

    await sendResetPasswordEmail(validRequest, response, {
      container: {
        ...container,
        getSendEmail: () => getSendEmailStub,
      },
    });

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "GovNotify error occured" })
    );
  });
});
