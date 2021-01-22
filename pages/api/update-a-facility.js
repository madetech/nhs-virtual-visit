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
    const { uuid, name, status } = body;
    if (!body || !uuid || !name || status == undefined) {
      res.status(400);
      res.end(
        JSON.stringify({ err: "facility id, name and status must be present" })
      );
      return;
    }

    const { error } = await container.getRetrieveFacilityByUuid()(
      uuid,
      name,
      status
    );

    if (error) {
      res.status(404);
      res.end(
        JSON.stringify({
          err: "facility does not exist in current organisation",
        })
      );
      return;
    }

    const {
      uuid: facilityUuid,
      error: updateError,
    } = await container.getUpdateFacility()({
      uuid,
      name,
      status,
    });

    if (updateError) {
      res.status(500);
      res.end(JSON.stringify({ error: "failed to update hospital" }));
    } else {
      res.status(200);
      res.end(JSON.stringify({ uuid: facilityUuid }));
    }
  }
);
