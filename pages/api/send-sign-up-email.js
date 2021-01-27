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

    if (!body.organisation) {
      res.status(400);
      res.end(JSON.stringify({ err: "organisation must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const managerObj = {
      email: body.email,
      password: body.password,
      organisationId: body.organisation.id,
    };
    const createManager = container.getCreateManager();
    const { user, error } = await createManager(managerObj);

    if (error) {
      res.status(400);
      res.end(JSON.stringify({ err: error }));
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
        res.end(JSON.stringify({ err: error }));
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
      type: "confirmRegistration",
    });

    if (verificationError) {
      res.status(400);
      res.end(JSON.stringify({ err: verificationError }));
      return;
    }

    const uuid = manager ? manager.uuid : user.uuid;
    const hash = verifyUser.hash;
    const sendEmail = container.getSendEmail();
    const emailTemplateId = manager
      ? TemplateStore().signUpRequestEmail.templateId
      : TemplateStore().signUpEmail.templateId;
    const expirationTime = "48h";
    const urlPath = "activate-account";

    const { link, linkError } = createTimeSensitiveLink(
      headers,
      uuid,
      hash,
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

    let personalisationKeys = { link };

    if (manager) {
      personalisationKeys = {
        ...personalisationKeys,
        email: body.email,
        organisation_name: body.organisation.name,
      };
    }

    const emailAddress = manager.email;

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
  }
);
