import withContainer from "../../src/middleware/withContainer";
import {
  validateHttpMethod,
  checkIfAuthorised,
} from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);

    const userIsAuthenticatedInstance = container.getUserIsAuthenticated();
    const userIsAuthenticatedResponse = await userIsAuthenticatedInstance(
      headers.cookie
    );

    checkIfAuthorised(userIsAuthenticatedResponse, res);

    let { wardId, trustId } = userIsAuthenticatedResponse;
    if (!trustId) {
      res.status(400);
      res.end(JSON.stringify({ err: "no trustId" }));
      return;
    }
    if (!wardId) {
      res.status(400);
      res.end(JSON.stringify({ err: "no wardId" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const {
      organisation: trust,
      error: trustErr,
    } = await container.getRetrieveOrganisationById()(trustId);

    if (trustErr) {
      res.status(400);
      res.end(JSON.stringify({ trustErr }));
      return;
    }

    const {
      department: ward,
      error: wardErr,
    } = await container.getRetrieveDepartmentById()(wardId, trustId);
    if (wardErr) {
      res.status(400);
      res.end(JSON.stringify({ wardErr }));
      return;
    }

    const callPassword = container.getRandomIdProvider().generate(10);
    const provider = container.getCallIdProvider(
      trust.videoProvider,
      body.callTime
    );
    const callId = await provider.generate();
    const callTime = new Date(body.callTime);

    try {
      const { success, err } = await container.getCreateVisit()(
        {
          patientName: body.patientName,
          recipientEmail: body.contactEmail,
          recipientNumber: body.contactNumber,
          recipientName: body.contactName,
          callTime: callTime,
          callTimeLocal: body.callTimeLocal,
        },
        ward,
        callId,
        callPassword,
        trust.videoProvider
      );

      if (!success) {
        res.status(400);
        res.end(JSON.stringify({ err }));
        return;
      }

      res.status(201);
      res.end(JSON.stringify({ success: true }));
    } catch (err) {
      console.error(err);
      res.status(500);
      res.end(JSON.stringify({ err: "Failed to schedule a visit" }));
    }
  }
);
