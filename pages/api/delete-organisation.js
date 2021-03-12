import withContainer from "../../src/middleware/withContainer";
import { validateHttpMethod } from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("DELETE", method, res);

    const adminIsAuthenticated = container.getAdminIsAuthenticated();

    if (!adminIsAuthenticated(headers.cookie)) {
      res.status(401);
      res.end(JSON.stringify({ err: "not authenticated" }));
      return;
    }

    if (!body.id) {
      res.status(400);
      res.end(JSON.stringify({ err: "organisation id must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const deleteOrganisation = container.getDeleteOrganisation();

    const { error } = await deleteOrganisation(body.id);

    if (error) {
      res.status(409);
      res.end(
        JSON.stringify({ err: "There was an error deleting the organisation" })
      );
    } else {
      res.status(204);
      res.end();
    }
  }
);
