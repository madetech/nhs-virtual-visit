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
    const trustAdminAuthenticatedToken = trustAdminIsAuthenticated(
      headers.cookie
    );
    checkIfAuthorised(trustAdminAuthenticatedToken, res);

    if (!body.name || body.name.length === 0) {
      res.status(400);
      res.end(JSON.stringify({ error: "name must be present" }));
      return;
    }

    if (!body.facilityId) {
      res.status(400);
      res.end(JSON.stringify({ error: "facility id must be present" }));
      return;
    }

    if (!body.pin) {
      res.status(400);
      res.end(JSON.stringify({ error: "department pin must be present" }));
      return;
    }

    if (!body.code) {
      res.status(400);
      res.end(JSON.stringify({ error: "department code must be present" }));
      return;
    }
    res.setHeader("Content-Type", "application/json");
    try {
      const { name, facilityId, pin, code } = body;
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
