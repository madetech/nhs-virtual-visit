import withContainer from "../../src/middleware/withContainer";
import {
  validateHttpMethod,
  checkIfAuthorised,
} from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);

    const trustAdminIsAuthenticated = container.getOrganisationAdminIsAuthenticated();
    const trustAdminToken = trustAdminIsAuthenticated(headers.cookie);
    checkIfAuthorised(trustAdminIsAuthenticated(headers.cookie), res);

    if (!body.name) {
      res.status(400);
      res.end(JSON.stringify({ error: "name must be present" }));
      return;
    }

    if (!body.orgId) {
      res.status(400);
      res.end(JSON.stringify({ error: "facility id must be present" }));
      return;
    }

    if (!body.code) {
      res.status(400);
      res.end(JSON.stringify({ error: "facility code must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");
    const { name, orgId, code } = body;
    const { uuid, error } = await container.getCreateFacility()({
      name,
      orgId,
      code,
      createdBy: trustAdminToken.userId,
    });

    if (error) {
      res.status(400);
      res.end(JSON.stringify({ error: "Facility name already exists" }));
    } else {
      res.status(201);
      res.end(JSON.stringify({ uuid }));
    }
  }
);
