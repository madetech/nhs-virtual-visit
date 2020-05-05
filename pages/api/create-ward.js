import withContainer from "../../src/middleware/withContainer";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    if (method !== "POST") {
      res.status(405);
      res.end();
      return;
    }

    const adminIsAuthenticated = container.getAdminIsAuthenticated();

    if (!adminIsAuthenticated(headers.cookie)) {
      res.status(401);
      res.end();
      return;
    }

    if (!body.name || body.name.length === 0) {
      res.status(400);
      res.end(JSON.stringify({ err: "name must be present" }));
      return;
    }

    if (!body.hospitalName || body.hospitalName.length === 0) {
      res.status(400);
      res.end(JSON.stringify({ err: "hospital name must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const createWard = container.getCreateWard();

    const { error } = await createWard({
      name: body.name,
      hospitalName: body.hospitalName,
      code: body.code,
    });

    if (error) {
      res.status(400);
      res.end();
    } else {
      res.status(201);
      res.end();
    }
  }
);
