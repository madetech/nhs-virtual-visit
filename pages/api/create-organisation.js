import withContainer from "../../src/middleware/withContainer";
import { validateHttpMethod } from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);

    const adminIsAuthenticated = container.getAdminIsAuthenticated();

    if (!adminIsAuthenticated(headers.cookie)) {
      res.status(401);
      res.end(JSON.stringify({ err: "not authenticated" }));
      return;
    }

    if (!body.name) {
      res.status(400);
      res.end(JSON.stringify({ err: "trust name must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const createOrganisation = container.getCreateOrganisation();

    const { organisationId, error } = await createOrganisation({
      name: body.name,
      type: "trust",
      createdBy: body.userId,
    });

    if (error) {
      res.status(409);
      res.end(
        JSON.stringify({ err: "There was an error creating a new trust" })
      );
    } else {
      res.status(201);
      res.end(JSON.stringify({ organisationId }));
    }
  }
);
