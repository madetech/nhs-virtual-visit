import withContainer from "../../src/middleware/withContainer";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    if (method !== "DELETE") {
      res.status(405);
      res.end();
      return;
    }

    const trustAdminIsAuthenticated = container.getTrustAdminIsAuthenticated();

    const trustAdminAuthenticatedToken = trustAdminIsAuthenticated(
      headers.cookie
    );
    if (!trustAdminAuthenticatedToken) {
      res.status(401);
      res.end();
      return;
    }

    if (!body.uuid) {
      res.status(400);
      res.end(JSON.stringify({ error: "Manager uuid must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const archiveManagerByUuid = container.getArchiveManagerByUuid();

    const { success, error } = await archiveManagerByUuid(body.uuid);

    if (error) {
      res.status(400);
      res.end(JSON.stringify({ error }));
    } else {
      res.status(200);
      res.end(JSON.stringify(success));
    }
  }
);
