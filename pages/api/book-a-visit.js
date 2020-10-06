import withContainer from "../../src/middleware/withContainer";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    if (method !== "POST") {
      res.status(406);
      res.end();
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

    let { wardId, trustId } = userIsAuthenticatedResponse;

    res.setHeader("Content-Type", "application/json");

    try {
      const createVisit = await container.getCreateVisit();

      const { success, err } = await createVisit(
        {
          patientName: body.patientName,
          contactEmail: body.contactEmail,
          contactNumber: body.contactNumber,
          contactName: body.contactName,
          callTime: body.callTime,
          callTimeLocal: body.callTimeLocal,
        },
        wardId,
        trustId
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
