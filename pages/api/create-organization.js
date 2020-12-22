import withContainer from "../../src/middleware/withContainer";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    if (method !== "POST") {
      res.status(405);
      res.end(JSON.stringfify({ err: "method not allowed" }));
      return;
    }

    const adminIsAuthenticated = container.getAdminIsAuthenticated();

    if (!adminIsAuthenticated(headers.cookie)) {
      res.status(401);
      res.end(JSON.stringify({ err: "not authenticated" }));
      return;
    }

    if (!body.name) {
      res.status(409);
      res.end(JSON.stringify({ err: "trust name must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const createOrganization = container.getCreateOrganization();

    const { organizationId, error } = await createOrganization({
      name: body.name,
      status: body.status,
    });

    if (error) {
      res.status(409);
      res.end(JSON.stringify({ err: "Trust name already exists" }));
    } else {
      res.status(201);
      res.end(JSON.stringify({ organizationId }));
    }
  }
);
