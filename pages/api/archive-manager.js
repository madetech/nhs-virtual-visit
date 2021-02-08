import withContainer from "../../src/middleware/withContainer";
import {
  validateHttpMethod,
  checkIfAuthorised,
} from "../../src/helpers/apiErrorHandler";
import { statusToId, DISABLED } from "../../src/helpers/statusTypes";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("DELETE", method, res);

    const trustAdminIsAuthenticated = container.getOrganisationAdminIsAuthenticated();

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
    try {
      const { error } = await container.getUpdateManagerStatusByUuid()({
        uuid: body.uuid,
        status: statusToId(DISABLED),
      });

      if (error) {
        console.log(error);
        res.status(400);
      } else {
        res.status(200);
      }
      res.end(JSON.stringify({ error }));
    } catch (error) {
      console.log(error);
      res.status(500);
      res.end(
        JSON.stringify({
          error: "500 (Internal Server Error). Please try again later.",
        })
      );
    }
  }
);
