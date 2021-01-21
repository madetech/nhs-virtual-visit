import sendSignUpEmail from "../../../pages/api/send-sign-up-email";
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
        password: "password",
        organisationId: 1,
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
            email: "nhs-manager@nhs.co.uk",
            password: "hashedpassword",
            type: "manager",
            organisationId: 1,
            status: 0,
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
    });
    bcrypt.hashSync.mockReturnValue("hashedPassword");
  });

  it("returns 405 if not POST method", async () => {
    validRequest.method = "GET";

    await sendSignUpEmail(validRequest, response, {
      container: container,
    });

    expect(response.status).toHaveBeenCalledWith(405);
  });

  it("returns a 400 if the email is not present", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        email: "",
        password: "password",
        organisationId: 1,
      },
      headers: {
        cookie: "",
      },
    };

    await sendSignUpEmail(invalidRequest, response, {
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
        organisationId: 1,
      },
      headers: {
        cookie: "",
      },
    };

    await sendSignUpEmail(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "password must be present" })
    );
  });

  it("returns a 400 if the organisationId is not present", async () => {
    const invalidRequest = {
      method: "POST",
      body: {
        email: "nhs-manager@nhs.co.uk",
        password: "password",
        organisationId: null,
      },
      headers: {
        cookie: "",
      },
    };

    await sendSignUpEmail(invalidRequest, response, {
      container: {
        ...container,
      },
    });

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.end).toHaveBeenCalledWith(
      JSON.stringify({ err: "organisation must be present" })
    );
  });

  it("returns a 400 if there is an error returned from createManager database call", async () => {
    const createManagerSpy = jest.fn().mockReturnValue({
      user: null,
      error: "There was an error",
    });

    await sendSignUpEmail(validRequest, response, {
      container: {
        ...container,
        getCreateManager: () => createManagerSpy,
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

    await sendSignUpEmail(validRequest, response, {
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

    await sendSignUpEmail(validRequest, response, {
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

  it("returns a 201 if the sendEmail is successful", async () => {
    const sendEmailSpy = jest.fn().mockReturnValue({ error: null });

    await sendSignUpEmail(validRequest, response, {
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

    await sendSignUpEmail(validRequest, response, {
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
});
