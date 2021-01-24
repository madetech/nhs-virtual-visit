import withContainer from "../../src/middleware/withContainer";
import {
  validateHttpMethod,
  checkIfAuthorised,
} from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);

    const trustAdminIsAuthenticated = container.getTrustAdminIsAuthenticated();
    const trustAdminToken = trustAdminIsAuthenticated(headers.cookie);
    checkIfAuthorised(trustAdminIsAuthenticated(headers.cookie), res);
    const { name, orgId, code } = body;
    if (!name) {
      res.status(400);
      res.end(JSON.stringify({ err: "name must be present" }));
      return;
    }

    if (!orgId) {
      res.status(400);
      res.end(JSON.stringify({ err: "organisation ID must be present" }));
      return;
    }

    if (!code) {
      res.status(400);
      res.end(JSON.stringify({ err: "organisation code must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const { uuid, error } = await container.getCreateFacility()({
      name,
      orgId,
      code,
      createdBy: trustAdminToken.userId,
    });

    if (error) {
      res.status(400);
      res.end(JSON.stringify({ err: "Facility name already exists" }));
    } else {
      res.status(201);
      res.end(JSON.stringify({ uuid }));
    }
  }
);