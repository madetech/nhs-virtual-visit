import withContainer from "../../src/middleware/withContainer";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    if (method !== "PATCH") {
      res.status(405);
      res.end();
      return;
    }

    const trustAdminIsAuthenticated = container.getTrustAdminIsAuthenticated();

    const trustAdminToken = trustAdminIsAuthenticated(headers.cookie);

    if (!trustAdminToken) {
      res.status(401);
      res.end();
      return;
    }

    if (!body || !body.uuid || !body.status) {
      res.status(400);
      res.end(
        JSON.stringify({
          error: "Manager uuid and status must be present",
        })
      );
      return;
    }

    const retrieveManagerByUuid = container.getRetrieveManagerByUuid();

    const existingManager = await retrieveManagerByUuid(body.uuid);

    if (existingManager.error) {
      res.status(404);
      res.end(
        JSON.stringify({
          error: "Manager does not exist in current organisation",
        })
      );
      return;
    }

    const updateManager = container.getUpdateManagerByUuid();

    const { uuid, error } = await updateManager({
      uuid: body.uuid,
      status: body.status,
    });

    if (error) {
      res.status(500);
      res.end(JSON.stringify({ error }));
    } else {
      res.status(200);
      res.end(JSON.stringify({ uuid }));
    }
  }
);
