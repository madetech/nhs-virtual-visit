import withContainer from "../../src/middleware/withContainer";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    if (method !== "PATCH") {
      res.status(405);
      res.end();
      return;
    }

    const adminIsAuthenticated = container.getAdminIsAuthenticated();

    const adminToken = adminIsAuthenticated(headers.cookie);

    if (!adminToken) {
      res.status(401);
      res.end();
      return;
    }

    if (!body) {
      res.status(400);
      res.end(
        JSON.stringify({ err: "id, name and hospital name must be present" })
      );
      return;
    }

    if (!body.id) {
      res.status(400);
      res.end(JSON.stringify({ err: "id must be present" }));
      return;
    }

    if (!body.name) {
      res.status(400);
      res.end(JSON.stringify({ err: "name must be present" }));
      return;
    }

    if (!body.hospitalName) {
      res.status(400);
      res.end(JSON.stringify({ err: "hospital name must be present" }));
      return;
    }

    const retrieveWardById = container.getRetrieveWardById();

    const existingWard = await retrieveWardById(body.id, adminToken.trustId);

    if (existingWard.error) {
      res.status(400);
      res.end(JSON.stringify({ err: "ward does not exist in current trust" }));
      return;
    }

    const updateWard = container.getUpdateWard();

    const { wardId, error } = await updateWard({
      id: body.id,
      name: body.name,
      hospitalName: body.hospitalName,
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
