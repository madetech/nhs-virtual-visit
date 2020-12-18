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

    if (!body.wardId) {
      res.status(400);
      res.end(JSON.stringify({ err: "ward id must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const archiveWard = container.getArchiveWard();

    const { success, error } = await archiveWard(
      body.wardId,
      trustAdminAuthenticatedToken.trustId
    );

    if (error) {
      res.status(400);
      res.end(JSON.stringify("Could not delete ward"));
    } else {
      res.status(200);
      res.end(JSON.stringify(success));
    }
  }
);
