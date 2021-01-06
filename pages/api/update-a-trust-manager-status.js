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
        JSON.stringify({ err: "trust manager uuid and status must be present" })
      );
      return;
    }

    const retrieveOrgManagerByUuid = container.getRetrieveOrgManagerByUuid();

    const existingOrgManager = await retrieveOrgManagerByUuid(body.uuid);

    if (existingOrgManager.error) {
      res.status(404);
      res.end(
        JSON.stringify({
          err: "Organisation Manager does not exist in current trust",
        })
      );
      return;
    }

    const updateOrgManager = container.getUpdateOrgManagerByUuid();

    const { uuid, error } = await updateOrgManager({
      uuid: body.uuid,
      status: body.status,
    });

    if (error) {
      res.status(500);
      res.end(
        JSON.stringify({ error: "failed to update organisation manager" })
      );
    } else {
      res.status(200);
      res.end(JSON.stringify({ uuid }));
    }
  }
);
