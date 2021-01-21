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

    const managerObj = {
      email: body.email,
      password: body.password,
      organisationId: body.organisationId,
    };
    const createManager = container.getCreateManager();
    const { user, error } = await createManager(managerObj);

    if (error) {
      res.status(400);
      res.end(JSON.stringify({ err: error }));
      return;
    }

    const addToUserVerificationTable = container.getAddToUserVerificationTable();
    const {
      verifyUser,
      error: verificationError,
    } = await addToUserVerificationTable({
      user_id: user.id,
      type: "confirmRegistration",
    });

    console.log(verifyUser);
    if (verificationError) {
      res.status(400);
      res.end(JSON.stringify({ err: verificationError }));
      return;
    }

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

    const emailAddress = body.email;
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
