import withContainer from "../../src/middleware/withContainer";
import createTimeSensitiveLink from "../../src/helpers/createTimeSensitiveLink";
import TemplateStore from "../../src/gateways/GovNotify/TemplateStore";
import { validateHttpMethod } from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);

    if (!body.email) {
      res.status(400);
      res.end(JSON.stringify({ err: "email must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const retrieveEmailAndHashedPassword = container.getRetrieveEmailAndHashedPassword();
    const {
      emailAddress,
      hashedPassword,
      error,
    } = await retrieveEmailAndHashedPassword(body.email);

    if (error || !emailAddress) {
      res.status(400);
      res.end(JSON.stringify({ err: "Email does not exist" }));
      return;
    }

    const sendEmail = container.getSendEmail();
    const resetPasswordEmailTemplateId = TemplateStore().resetPasswordEmail
      .templateId;
    const expirationTime = "2h";
    const urlPath = "reset-password";
    const { link, linkError } = createTimeSensitiveLink(
      headers,
      emailAddress,
      hashedPassword,
      expirationTime,
      urlPath
    );

    if (linkError) {
      res.status(401);
      JSON.stringify({
        error: "There was an error creating link to reset password",
      });
    }
    try {
      await sendEmail(
        resetPasswordEmailTemplateId,
        emailAddress,
        { link: link },
        null
      );

      res.status(201);
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      res.status(401);
      res.end(
        JSON.stringify({
          err: `GovNotify error occurred: ${err?.error?.errors[0]?.message}`,
        })
      );
    }
  }
);
