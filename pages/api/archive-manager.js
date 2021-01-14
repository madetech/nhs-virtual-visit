import withContainer from "../../src/middleware/withContainer";

import {
  validateHttpMethod,
  checkIfAuthorised,
} from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("DELETE", method, res);

    const trustAdminIsAuthenticated = container.getTrustAdminIsAuthenticated();

    const trustAdminAuthenticatedToken = trustAdminIsAuthenticated(
      headers.cookie
    );

    checkIfAuthorised(trustAdminAuthenticatedToken, res);

    if (!body.uuid) {
      res.status(400);
      res.end(JSON.stringify({ error: "Manager uuid must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const archiveManagerByUuid = container.getArchiveManagerByUuid();

    const { error } = await archiveManagerByUuid(body.uuid);

    if (error) {
      console.log("in error");
      res.status(400);
      res.end(JSON.stringify({ error }));
    } else {
      res.status(200);
      res.end(JSON.stringify({ error }));
    }
  }
);
