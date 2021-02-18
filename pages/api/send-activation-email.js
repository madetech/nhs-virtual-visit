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
    try {
      const retrieveManagerByEmail = container.getRetrieveManagerByEmail();
      const { manager: user, error } = await retrieveManagerByEmail(body.email);
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
  
      if (verificationError) {
        res.status(400);
        res.end(JSON.stringify({ err: verificationError }));
        return;
      }
  
      const uuid = user.uuid;
      const hash = verifyUser.hash;
      const sendEmail = container.getSendEmail();
      const emailTemplateId = TemplateStore().signUpEmail.templateId;
      const expirationTime = "48h";
      const urlPath = "activate-account";
      const email = body.email;
  
      const { link, linkError } = createTimeSensitiveLink({
        headers,
        uuid,
        hash,
        expirationTime,
        urlPath,
        email
      });
  
      if (linkError) {
        res.status(401);
        res.end(
          JSON.stringify({ err: "There was an error creating link to sign up" })
        );
        return;
      }
  
      const personalisationKeys = { link };
  
      const emailAddress = body.email;
  
      const { error: emailError } = await sendEmail(
        emailTemplateId,
        emailAddress,
        personalisationKeys,
        null
      );
  
      if (emailError) {
        res.status(401);
        res.end(JSON.stringify({ err: "GovNotify error occurred" }));
      } else {
        res.status(201);
        res.end(JSON.stringify({ email: emailAddress }));
      }
    } catch (error) {
      res.status(500)
      res.end(JSON.stringify({ err: `There has been an internal server error` }));
    }
    
  }
);
