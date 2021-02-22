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
      JSON.stringify({ error: "email must be present" })
    );
  });

  it("returns a 400 if there is an error returned from retrieveManagerByEmail", async () => {
    const getRetrieveManagerByEmailSpy = jest.fn().mockReturnValue({
      manager: {
        email: "nhs-admin@nhs.co.uk",
        uuid: "uuid",
      },
      error: "Email could not be found in database",
    });

    await sendResetPasswordEmail(validRequest, response, {
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

    await sendResetPasswordEmail(validRequest, response, {
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

    await sendResetPasswordEmail(validRequest, response, {
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
      JSON.stringify({ error: "GovNotify error occured" })
    );
  });
});
