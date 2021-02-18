import sendActivationEmail from "../../../pages/api/send-activation-email";
import createTimeSensitiveLink from "../../../src/helpers/createTimeSensitiveLink";
import TemplateStore from "../../../src/gateways/GovNotify/TemplateStore";
import bcrypt from "bcryptjs";

jest.mock("../../../src/helpers/createTimeSensitiveLink");
jest.mock("../../../src/gateways/GovNotify/TemplateStore");
jest.mock("bcryptjs");

describe("send-reset-password-email", () => {
  let validRequest, response, container;

  beforeEach(() => {
    validRequest = {
      method: "POST",
      body: {
        email: "nhs-manager@nhs.co.uk",
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
      getRetrieveManagerByEmail: jest.fn().mockReturnValue(() => {
        return {
          manager: {
            id: 1,
            email: "nhs-manager@nhs.co.uk",
            type: "manager",
            uuid: "uuid",
          },
          error: null,
        };
      }),
      getSendEmail: jest.fn().mockReturnValue(() => {
        return { success: true, error: null };
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
    TemplateStore.mockReturnValue({
      signUpEmail: {
        templateId: "templateId",
        personalisationKeys: "validLink",
      },
      signUpRequestEmail: {
        templateId: "requestTemplateId",
      },
    });
    bcrypt.hashSync.mockReturnValue("hashedPassword");
  });

  it("returns 405 if not POST method", async () => {
    validRequest.method = "GET";

    await sendActivationEmail(validRequest, response, { container: container });

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

    await sendActivationEmail(invalidRequest, response, { container });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "email must be present" })
    );
  });

  it("returns a 400 if there is an error returned from retrieveManager database call", async () => {
    const retrieveManagerByEmailStub = jest.fn().mockReturnValue({
      manager: null,
      error: "There was an error",
    });

    await sendActivationEmail(validRequest, response, {
      container: {
        ...container,
        getRetrieveManagerByEmail: () => retrieveManagerByEmailStub,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "There was an error" })
    );
  });

  it("returns a 400 if there is an error returned from addToUserVerificationTable database call", async () => {
    const addToUserVerificationTableSpy = jest.fn().mockReturnValue({
      error: "There was a verificationError",
    });

    await sendActivationEmail(validRequest, response, {
      container: {
        ...container,
        getAddToUserVerificationTable: () => addToUserVerificationTableSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "There was a verificationError" })
    );
  });

  it("returns a 401 if there is a linkError", async () => {
    createTimeSensitiveLink.mockReturnValue({
      link: "",
      linkError: "link error!",
    });

    await sendActivationEmail(validRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({
        err: "There was an error creating link to sign up",
      })
    );
  });

  it("returns a 201 if the sendEmail is successful", async () => {
    const sendEmailSpy = jest.fn().mockReturnValue({ error: null });

    await sendActivationEmail(validRequest, response, {
      container: {
        ...container,
        getSendEmail: () => sendEmailSpy,
      },
    });

    expect(response.status).toHaveBeenCalledWith(201);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ email: "nhs-manager@nhs.co.uk" })
    );
    expect(sendEmailSpy).toHaveBeenCalledWith(
      "templateId",
      "nhs-manager@nhs.co.uk",
      { link: "validLink" },
      null
    );
  });

  it("returns a 401 if the sendEmail is unsuccessful", async () => {
    const sendEmailStub = jest.fn().mockReturnValue({ error: "Error message" });

    await sendActivationEmail(validRequest, response, {
      container: {
        ...container,
        getSendEmail: () => sendEmailStub,
      },
    });

    expect(response.status).toHaveBeenCalledWith(401);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "GovNotify error occurred" })
    );
  });

  it("returns a 500 if the sendEmail throws an error", async () => {
    const sendEmailStub = jest.fn(() => {throw Error('Error')});

    await sendActivationEmail(validRequest, response, {
      container: {
        ...container,
        getSendEmail: () => sendEmailStub,
      },
    });

    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "There has been an internal server error" })
    );
  });
});
