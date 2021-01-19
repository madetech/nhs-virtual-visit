import withContainer from "../../src/middleware/withContainer";
import createTimeSensitiveLink from "../../src/helpers/createTimeSensitiveLink";
import TemplateStore from "../../src/gateways/GovNotify/TemplateStore";
import { validateHttpMethod } from "../../src/helpers/apiErrorHandler";
import bcrypt from "bcryptjs";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);

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
    const { user, error } = await createManager(managerObj);

    if (error) {
      res.status(400);
      res.end(JSON.stringify({ err: error }));
      return;
    }

    const verificationObj = {
      user_id: user.id,
      code: body.email,
      hash: hashedPassword,
      type: "manager",
    };

    const addToUserVerificationTable = container.getAddToUserVerificationTable();
    const { error: verificationError } = await addToUserVerificationTable(
      verificationObj
    );

    if (verificationError) {
      res.status(400);
      res.end(JSON.stringify({ err: verificationError }));
      return;
    }

    const emailAddress = body.email;
    const id = user.id;
    const sendEmail = container.getSendEmail();
    const signUpEmailTemplateId = TemplateStore().signUpEmail.templateId;
    const expirationTime = "48h";
    const urlPath = "activate-account";

    const { link, linkError } = createTimeSensitiveLink(
      headers,
      id,
      expirationTime,
      urlPath
    );

    if (linkError) {
      res.status(401);
      res.end(
        JSON.stringify({ error: "There was an error creating link to sign up" })
      );
      return;
    }

    const { error: emailError } = await sendEmail(
      signUpEmailTemplateId,
      emailAddress,
      { link: link },
      null
    );

    if (emailError) {
      res.status(401);
      res.end(JSON.stringify({ err: "GovNotify error occurred" }));
    } else {
      res.status(201);
      res.end(JSON.stringify({ email: emailAddress }));
    }
  }
);
