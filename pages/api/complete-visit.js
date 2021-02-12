import withContainer from "../../src/middleware/withContainer";
import {
  validateHttpMethod,
  checkIfAuthorised,
} from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);

    const userIsAuthenticated = container.getUserIsAuthenticated();
    const userIsAuthenticatedResponse = await userIsAuthenticated(
      headers?.cookie
    );

    checkIfAuthorised(userIsAuthenticatedResponse, res);

    if (!body.callId) {
      res.status(400);
      res.end(JSON.stringify({ err: "callId must be present" }));
      return;
    }

    const { error } = await container.getMarkVisitAsComplete()({
      id: body.callId,
      wardId: userIsAuthenticatedResponse.wardId,
    });

    if (error) {
      console.error(error);
      res.status(500);
      res.end(JSON.stringify({ err: "Unable to mark visit as complete" }));
    } else {
      res.status(201);
      res.end(JSON.stringify({}));
    }
  }
);
