import withContainer from "../../src/middleware/withContainer";
import validateVisit from "../../src/helpers/validateVisit";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    const respond = (status, response) => {
      res.status(status);
      response ? res.end(JSON.stringify(response)) : res.end();
    };

    if (method !== "PATCH") {
      respond(405);
      return;
    }

    const userIsAuthenticated = container.getUserIsAuthenticated();
    const userIsAuthenticatedResponse = await userIsAuthenticated(
      headers.cookie
    );

    if (!userIsAuthenticatedResponse) {
      respond(401, { err: "Unauthorized" });
      return;
    }

    if (!body.callId) {
      respond(400, { err: { callId: "callId must be present" } });
      return;
    }

    const { validVisit, errors } = validateVisit({
      patientName: body.patientName,
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactNumber: body.contactNumber,
      callTime: body.callTime,
    });

    if (!validVisit) {
      respond(400, { err: errors });
      return;
    }

    const { scheduledCall } = await container.getRetrieveVisitByCallId()(
      body.callId
    );
    if (!scheduledCall) {
      respond(404, { err: "call does not exist" });
      return;
    }

    const updatedCall = {
      callId: body.callId,
      patientName: body.patientName,
      contactName: body.contactName,
      contactEmail: body.contactEmail,
      contactNumber: body.contactNumber,
      callTime: body.callTime,
    };

    try {
      await container.getUpdateVisitByCallId()(updatedCall);
      respond(200, { success: true });
    } catch (updateError) {
      console.log(updateError);
      respond(500, { err: "Failed to update visit" });
      return;
    }
  }
);
