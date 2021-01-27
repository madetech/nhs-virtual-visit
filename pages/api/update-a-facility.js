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

    if (!body || !body.uuid || !body.name || body.status == undefined) {
      res.status(400);
      res.end(
        JSON.stringify({
          error: "facility uuid, name and status must be present",
        })
      );
      return;
    }
    try {
      const { uuid, name, status } = body;
      const { facility, error } = await container.getRetrieveFacilityByUuid()(
        uuid
      );

      if (error) {
        res.status(404);
        res.end(
          JSON.stringify({
            error: "facility does not exist in current organisation",
          })
        );
        return;
      }

      const {
        uuid: facilityUuid,
        error: updateError,
      } = await container.getUpdateFacilityById()({
        id: facility?.id,
        name,
        status,
      });

      if (updateError) {
        res.status(400);
        res.end(JSON.stringify({ error: updateError }));
      } else {
        res.status(200);
        res.end(JSON.stringify({ uuid: facilityUuid }));
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
