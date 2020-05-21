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

    if (!body.wardId) {
      res.status(400);
      res.end(JSON.stringify({ err: "ward id must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const archiveWard = container.getArchiveWard();

    const { success, error } = await archiveWard(
      body.wardId,
      trustAdminAuthenticatedToken.trustId
    );

    if (error) {
      res.status(400);
      res.end(JSON.stringify("Could not delete ward"));
    } else {
      res.status(200);
      res.end(JSON.stringify(success));
    }
  }
);
