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
    const trustAdminAuthenticatedToken = trustAdminIsAuthenticated(
      headers.cookie
    );
    checkIfAuthorised(trustAdminAuthenticatedToken, res);

    const { name, facilityId, pin, code } = body;
    if (!name || name.length === 0) {
      res.status(400);
      res.end(JSON.stringify({ err: "name must be present" }));
      return;
    }

    if (!facilityId) {
      res.status(400);
      res.end(JSON.stringify({ err: "facility id must be present" }));
      return;
    }

    if (!pin) {
      res.status(400);
      res.end(JSON.stringify({ err: "ward pin must be present" }));
      return;
    }

    if (!code) {
      res.status(400);
      res.end(JSON.stringify({ err: "ward code must be present" }));
      return;
    }
    res.setHeader("Content-Type", "application/json");

    const { uuid, error } = await container.getCreateWard()({
      name,
      code,
      pin,
      facilityId,
      createdBy: trustAdminToken.userId,
    });

    if (error) {
      res.status(400);
      res.end();
    } else {
      res.status(201);
      res.end(JSON.stringify({ uuid }));
    }
  }
);
