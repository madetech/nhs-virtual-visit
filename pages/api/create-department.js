import withContainer from "../../src/middleware/withContainer";
import {
  validateHttpMethod,
  checkIfAuthorised,
} from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);
    console.log("****in api***");
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
    try {
      const { uuid, error } = await container.getCreateDepartment()({
        name,
        code,
        pin,
        facilityId,
        createdBy: trustAdminToken.userId,
      });

      if (error) {
        res.status(400);
        res.end(JSON.stringify({ error }));
      } else {
        res.status(201);
        res.end(JSON.stringify({ uuid }));
      }
    } catch (error) {
      res.status(500);
      res.end(
        JSON.stringify({
          error: "500 (Internal Server Error). Please try again later.",
        })
      );
    }
  }
);
