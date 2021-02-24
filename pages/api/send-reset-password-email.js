import withContainer from "../../src/middleware/withContainer";
import createTimeSensitiveLink from "../../src/helpers/createTimeSensitiveLink";
import TemplateStore from "../../src/gateways/GovNotify/TemplateStore";
import { validateHttpMethod } from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);

    if (!body.email) {
      res.status(400);
      res.end(JSON.stringify({ error: "email must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const retrieveManagerByEmail = container.getRetrieveManagerByEmail();
    const { 
      manager: user,
      error: retrieveError, 
    } = await retrieveManagerByEmail(body.email);

    if (retrieveError || !user) {
      res.status(400);
      res.end(JSON.stringify({ error: "Email does not exist" }));
      return;
    }

    const addToUserVerificationTable = container.getAddToUserVerificationTable();
    const { 
      verifyUser,
      error: verificationError,
    } = await addToUserVerificationTable({
      user_id: user.id,
      type: "resetPassword",
    });

    if (verificationError) {
      res.status(400);
      res.end(JSON.stringify({ error: verificationError }));
      return;
    }
    
    const uuid = user.uuid;
    const hash = verifyUser.hash;    
    const sendEmail = container.getSendEmail();
    const resetPasswordEmailTemplateId = TemplateStore().resetPasswordEmail
      .templateId;
    const expirationTime = "2h";
    const urlPath = "reset-password";

    const { link, linkError } = createTimeSensitiveLink({
      headers,
      uuid,
      hash,
      expirationTime,
      urlPath,
    });
  
    if (linkError) {
      res.status(401);
      res.end(
        JSON.stringify({
          error: "There was an error creating link to reset password",
        })
      );
      return;
    }

    const { success, error: emailError } = await sendEmail(
      resetPasswordEmailTemplateId,
      user.email,
      { link: link },
      null
    );

    if (emailError) {
      res.status(401);
      res.end(JSON.stringify({ error: "GovNotify error occured" }));
    } else {
      res.status(201);
      res.end(JSON.stringify({ success }));
    }
  }
);
