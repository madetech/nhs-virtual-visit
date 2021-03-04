import withContainer from "../../src/middleware/withContainer";
import createTimeSensitiveLink from "../../src/helpers/createTimeSensitiveLink";
import TemplateStore from "../../src/gateways/GovNotify/TemplateStore";
import { validateHttpMethod } from "../../src/helpers/apiErrorHandler";
import validateSignUpEmailAddress from "../../src/helpers/validateSignUpEmailAddress";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);

    if (!body.email) {
      res.status(400);
      res.end(JSON.stringify({ error: "email must be present" }));
      return;
    }

    if (!body.password) {
      res.status(400);
      res.end(JSON.stringify({ error: "password must be present" }));
      return;
    }

    if (!body.organisation) {
      res.status(400);
      res.end(JSON.stringify({ error: "organisation must be present" }));
      return;
    }

    if (!validateSignUpEmailAddress(body.email)) {
      res.status(400);
      res.end(JSON.stringify({ error: "Please sign up with a valid NHS email" }));
      return;
    }
    res.setHeader("Content-Type", "application/json");

    try {
      const managerObj = {
        email: body.email,
        password: body.password,
        organisationId: body.organisation.id,
      };
      const createManager = container.getCreateManager();
      const { user, error: createManagerError } = await createManager(managerObj);
      if (createManagerError) {
        res.status(400);
        res.end(JSON.stringify({ error: createManagerError }));
        return;
      }
  
      let manager;
  
      if (body.organisation.status === 1) {
        const retrieveManagersByOrgId = container.getRetrieveManagersByOrgId();
        const {
          managers,
          error: retrieveManagerError,
        } = await retrieveManagersByOrgId(body.organisation.id);
  
        if (retrieveManagerError) {
          res.status(400);
          res.end(JSON.stringify({ error: retrieveManagerError }));
          return;
        }
        manager = managers[0];
      }
  
      const addToUserVerificationTable = container.getAddToUserVerificationTable();
      const {
        verifyUser,
        error: verificationError,
      } = await addToUserVerificationTable({
        user_id: manager ? manager.id : user.id,
        type: manager ? "authoriseUser" : "confirmRegistration",
      });
  
      if (verificationError) {
        res.status(400);
        res.end(JSON.stringify({ error: verificationError }));
        return;
      }
  
      const uuid = user.uuid;
      const hash = verifyUser.hash;
      const sendEmail = container.getSendEmail();
      const emailTemplateId = manager
        ? TemplateStore().signUpRequestEmail.templateId
        : TemplateStore().signUpEmail.templateId;
      const expirationTime = "48h";
      const urlPath = manager ? "authorise-user" : "activate-account";
  
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
          JSON.stringify({ error: "There was an error creating link to sign up" })
        );
        return;
      }
  
      let personalisationKeys = { link };
  
      if (manager) {
        personalisationKeys = {
          ...personalisationKeys,
          email: body.email,
          organisation_name: body.organisation.name,
        };
      }
  
      const emailAddress = manager ? manager.email : body.email;
  
      const { error: emailError } = await sendEmail(
        emailTemplateId,
        emailAddress,
        personalisationKeys,
        null
      );
  
      if (emailError) {
        res.status(401);
        res.end(JSON.stringify({ error: "GovNotify error occurred" }));
      } else {
        res.status(201);
        res.end(JSON.stringify({ email: emailAddress }));
      }
    } catch(error){
      res.status(500);
      res.end(JSON.stringify({ error: "Internal server error occurred" }));
    }   
  }
);
