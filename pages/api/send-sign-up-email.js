import withContainer from "../../src/middleware/withContainer";
import createTimeSensitiveLink from "../../src/helpers/createTimeSensitiveLink";
import TemplateStore from "../../src/gateways/GovNotify/TemplateStore";
import bcrypt from "bcryptjs";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    if (method !== "POST") {
      res.status(405);
      res.end(JSON.stringify({ err: "method not allowed" }));
      return;
    }

    if (!body.email) {
      res.status(400);
      res.end(JSON.stringify({ err: "email must be present" }));
      return;
    }

    if (!body.password) {
      res.status(400);
      res.end(JSON.stringify({ err: "password must be present" }));
      return;
    }

    if (!body.organisationId) {
      res.status(400);
      res.end(JSON.stringify({ err: "organisation must be present" }));
      return;
    }
    res.setHeader("Content-Type", "application/json");

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(body.password, salt);

    const managerObj = {
      email: body.email,
      password: hashedPassword,
      organisationId: body.organisationId,
      type: "manager",
    };
    const createManager = container.getCreateManager();
    const { error } = await createManager(managerObj);

    if (error) {
      res.status(400);
      res.end(JSON.stringify({ err: error }));
      return;
    }

    const emailAddress = body.email;
    const sendEmail = container.getSendEmail();
    const signUpEmailTemplateId = TemplateStore().signUpEmail.templateId;
    const expirationTime = "48h";
    const urlPath = "activate-account";

    const { link, linkError } = createTimeSensitiveLink(
      headers,
      emailAddress,
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
        signUpEmailTemplateId,
        emailAddress,
        { link: link },
        null
      );

      res.status(201);
      res.end(JSON.stringify({ email: emailAddress }));
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
