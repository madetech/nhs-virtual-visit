import withContainer from "../../src/middleware/withContainer";
import {
  validateHttpMethod,
  checkIfAuthorised,
} from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);

    const trustAdminIsAuthenticated = container.getTrustAdminIsAuthenticated();

    const trustAdminAuthenticatedToken = trustAdminIsAuthenticated(
      headers.cookie
    );

    checkIfAuthorised(trustAdminAuthenticatedToken, res);

    if (!body.name || body.name.length === 0) {
      res.status(400);
      res.end(JSON.stringify({ err: "name must be present" }));
      return;
    }

    if (!body.hospitalId) {
      res.status(400);
      res.end(JSON.stringify({ err: "hospital id must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const createWard = container.getCreateWard();

    const { wardId, error } = await createWard({
      name: body.name,
      code: body.code,
      pin: body.pin,
      trustId: trustAdminAuthenticatedToken.trustId,
      hospitalId: body.hospitalId,
    });

    if (error) {
      res.status(400);
      res.end();
    } else {
      res.status(201);
      res.end(JSON.stringify({ wardId: wardId }));
    }
  }
);
