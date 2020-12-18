import withContainer from "../../src/middleware/withContainer";
import validateHttpMethod from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);

    const userIsAuthenticated = container.getUserIsAuthenticated();
    const userIsAuthenticatedResponse = await userIsAuthenticated(
      headers?.cookie
    );

    if (!userIsAuthenticatedResponse) {
      res.status(401);
      res.end(JSON.stringify({ err: "Unauthorized" }));
      return;
    }

    if (!body.callId) {
      res.status(400);
      res.end(JSON.stringify({ err: "callId must be present" }));
      return;
    }

    const {
      scheduledCall,
      error: retrieveVisitError,
    } = await container.getRetrieveVisitByCallId()(body.callId);

    if (retrieveVisitError) {
      console.error(retrieveVisitError);
      res.status(401);
      res.end(JSON.stringify({ err: "Visit not found" }));
      return;
    }

    const { error } = await container.getMarkVisitAsComplete()({
      id: scheduledCall.id,
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
