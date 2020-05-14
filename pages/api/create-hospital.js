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

    if (!body.name) {
      res.status(400);
      res.end(JSON.stringify({ err: "name must be present" }));
      return;
    }

    if (!body.trustId) {
      res.status(400);
      res.end(JSON.stringify({ err: "trust ID must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const createHospital = container.getCreateHospital();

    const { hospitalId, error } = await createHospital({
      name: body.name,
      trustId: body.trustId,
    });

    if (error) {
      res.status(400);
      res.end(JSON.stringify({ err: "Hospital name already exists" }));
    } else {
      res.status(201);
      res.end(JSON.stringify({ hospitalId: hospitalId }));
    }
  }
);
