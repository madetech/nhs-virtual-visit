import withContainer from "../../../src/middleware/withContainer";
import createTimeSensitiveLink from "../../../src/helpers/createTimeSensitiveLink";
import { validateHttpMethod } from "../../../src/helpers/apiErrorHandler";
import { statusToId, ACTIVE, DISABLED } from "../../../src/helpers/statusTypes";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    if (process.env.APP_ENV !== "test") {
      res.status(403);
      res.end(JSON.stringify({ error: "Can't access this endpoint from a production environment" }));
      return;
    }

    validateHttpMethod("POST", method, res);

    res.setHeader("Content-Type", "application/json");

    try {
      let organisation;
      if (body.type === "activation") {
        organisation = { id: 2, status: statusToId(DISABLED) }
      } else {
        organisation = { id: 1, status: statusToId(ACTIVE) }
      }

      const managerObj = {
        email: "nhs-person@nhs.co.uk",
        password: "password",
        organisationId: organisation.id,
      }
      const createManager = container.getCreateManager();
      const { user, error: createManagerError } = await createManager(managerObj);
      if (createManagerError) {
        res.status(400);
        res.end(JSON.stringify({ error: createManagerError }));
        return;
      }
  
      let manager;
  
      if (organisation.status === 1) {
        const retrieveManagersByOrgId = container.getRetrieveManagersByOrgId();
        const {
          managers,
          error: retrieveManagerError,
        } = await retrieveManagersByOrgId(organisation.id);
  
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
      } else {
        res.status(201);
        res.end(JSON.stringify({ link }));
      }
    } catch(error){
        res.status(500);
        res.end(JSON.stringify({ error: "Internal server error occurred" }));
    }   
  }
);
