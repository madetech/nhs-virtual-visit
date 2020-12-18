import withContainer from "../../src/middleware/withContainer";
import isGuid from "../../src/helpers/isGuid";
import { JOIN_VISIT, LEAVE_VISIT } from "../../src/helpers/eventActions";
import validateHttpMethod from "../../src/helpers/apiErrorHandler";

const actions = [JOIN_VISIT, LEAVE_VISIT];

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);

    const userIsAuthenticated = container.getUserIsAuthenticated();
    const userIsAuthenticatedResponse = await userIsAuthenticated(
      headers?.cookie
    );

    const verifyCallPassword = container.getVerifyCallPassword();
    const { validCallPassword } = await verifyCallPassword(
      body.callId,
      body.callPassword
    );

    if (!userIsAuthenticatedResponse && !validCallPassword) {
      res.status(401);
      res.end(JSON.stringify({ err: "Unauthorized" }));
      return;
    }

    if (!body.action || !actions.includes(body.action)) {
      res.status(400);
      res.end(JSON.stringify({ err: "action must be present" }));
      return;
    }

    if (!body.visitId || isNaN(body.visitId)) {
      res.status(400);
      res.end(JSON.stringify({ err: "visitId must be present" }));
      return;
    }

    if (!body.callSessionId || !isGuid(body.callSessionId)) {
      res.status(400);
      res.end(JSON.stringify({ err: "callSessionId must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const captureEvent = container.getCaptureEvent();

    const { eventId, error } = await captureEvent({
      action: body.action,
      visitId: body.visitId,
      callSessionId: body.callSessionId,
    });

    if (error) {
      res.status(500);
      res.end(JSON.stringify({ err: "Unable to capture event" }));
    } else {
      res.status(201);
      res.end(JSON.stringify({ eventId: eventId }));
    }
  }
);
