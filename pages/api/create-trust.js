import withContainer from "../../src/middleware/withContainer";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    if (method !== "POST") {
      res.status(405);
      res.end(JSON.stringify({ err: "method not allowed" }));
      return;
    }

    const adminIsAuthenticated = container.getAdminIsAuthenticated();

    if (!adminIsAuthenticated(headers.cookie)) {
      res.status(401);
      res.end(JSON.stringify({ err: "not authenticated" }));
      return;
    }

    if (!body.name) {
      res.status(400);
      res.end(JSON.stringify({ err: "name must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const createTrust = container.getCreateTrust();

    const { trustId, error } = await createTrust({
      name: body.name,
    });

    if (error) {
      res.status(409);
      res.end(JSON.stringify({ err: "Trust name already exists" }));
    } else {
      res.status(201);
      res.end(JSON.stringify({ trustId: trustId }));
    }
  }
);
