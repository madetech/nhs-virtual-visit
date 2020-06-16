import withContainer from "../../src/middleware/withContainer";
import isGuid from "../../src/helpers/isGuid";

const actions = ["join-visit", "leave-visit"];

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    if (method !== "POST") {
      res.status(405);
      res.end(JSON.stringify({ err: "method not allowed" }));
      return;
    }

    const userIsAuthenticated = container.getUserIsAuthenticated();
    const userIsAuthenticatedResponse = await userIsAuthenticated(
      headers.cookie
    );

    if (!userIsAuthenticatedResponse) {
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

    if (!body.sessionId || !isGuid(body.sessionId)) {
      res.status(400);
      res.end(JSON.stringify({ err: "sessionId must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const captureEvent = container.getCaptureEvent();

    const { eventId, error } = await captureEvent({
      action: body.action,
      visitId: body.visitId,
      sessionId: body.sessionId,
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
