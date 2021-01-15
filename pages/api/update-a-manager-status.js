import withContainer from "../../src/middleware/withContainer";
import {
  validateHttpMethod,
  checkIfAuthorised,
} from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("PATCH", method, res);

    const trustAdminIsAuthenticated = container.getTrustAdminIsAuthenticated();

    const trustAdminToken = trustAdminIsAuthenticated(headers.cookie);
    checkIfAuthorised(trustAdminToken, res);

    if (!body || !body.uuid || !body.status) {
      res.status(400);
      res.end(
        JSON.stringify({
          error: "Manager uuid and status must be present",
        })
      );
      return;
    }

    const retrieveManagerByUuid = container.getRetrieveManagerByUuid();

    const existingManager = await retrieveManagerByUuid(body.uuid);

    if (existingManager.error) {
      res.status(404);
      res.end(
        JSON.stringify({
          error: "Manager does not exist in current organisation",
        })
      );
      return;
    }

    const updateManager = container.getUpdateManagerByUuid();

    const { uuid, error } = await updateManager({
      uuid: body.uuid,
      status: body.status === "active" ? 1 : 0,
    });

    if (error) {
      res.status(500);
      res.end(JSON.stringify({ error }));
    } else {
      res.status(200);
      res.end(JSON.stringify({ uuid }));
    }
  }
);
