import withContainer from "../../src/middleware/withContainer";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    if (method !== "POST") {
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

    if (!body.name || body.name.length === 0) {
      res.status(400);
      res.end(JSON.stringify({ err: "name must be present" }));
      return;
    }

    if (!body.hospitalId) {
      res.status(400);
      res.end(JSON.stringify({ err: "hospital id must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const createWard = container.getCreateWard();

    const { wardId, error } = await createWard({
      name: body.name,
      code: body.code,
      trustId: trustAdminAuthenticatedToken.trustId,
      hospitalId: body.hospitalId,
    });

    if (error) {
      res.status(400);
      res.end();
    } else {
      res.status(201);
      res.end(JSON.stringify({ wardId: wardId }));
    }
  }
);
