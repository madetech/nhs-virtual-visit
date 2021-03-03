import withContainer from "../../src/middleware/withContainer";
import { validateHttpMethod } from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);
    if (!body.email) {
      res.status(400);
      res.end(JSON.stringify({ error: "email must be present "}));
    }

    res.setHeader("Content-Type", "application/json");

    const retrieveManagerByEmail = container.getRetrieveManagerByEmail();
    const { manager, error: managerError } = await retrieveManagerByEmail(body.email);

    if (managerError) {
      res.status(401);
      res.end(JSON.stringify({ error: "Error retrieving user" }));
    }

    const retrieveUserVerificationByUserId = container.getRetrieveUserVerificationByUserId();
    const { verifyUser, error } = await retrieveUserVerificationByUserId(manager.id);

    if (error) {
      res.status(401);
      res.end(JSON.stringify({ error: "Error retrieving user verification information" }));
    } else {
      res.status(201);
      res.send(JSON.stringify({ verifyUser }));
    }
  }
);
