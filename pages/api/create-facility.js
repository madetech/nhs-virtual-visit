import withContainer from "../../src/middleware/withContainer";
import {
  validateHttpMethod,
  checkIfAuthorised,
} from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);

    const trustAdminIsAuthenticated = container.getTrustAdminIsAuthenticated();

    checkIfAuthorised(trustAdminIsAuthenticated(headers.cookie), res);

    if (!body.name) {
      res.status(400);
      res.end(JSON.stringify({ err: "name must be present" }));
      return;
    }

    if (!body.orgId) {
      res.status(400);
      res.end(JSON.stringify({ err: "organisation ID must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const { facilityId, error } = await container.getCreateFacility()({
      name: body.name,
      orgId: body.orgId,
      code: body.code,
      createdBy: body.userId,
    });

    if (error) {
      res.status(400);
      res.end(JSON.stringify({ err: "Facility name already exists" }));
    } else {
      res.status(201);
      res.end(JSON.stringify({ facilityId }));
    }
  }
);
