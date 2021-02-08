import withContainer from "../../src/middleware/withContainer";
import {
  validateHttpMethod,
  checkIfAuthorised,
} from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("PATCH", method, res);

    const trustAdminIsAuthenticated = container.getOrganisationAdminIsAuthenticated();

    const trustAdminToken = trustAdminIsAuthenticated(headers.cookie);

    checkIfAuthorised(trustAdminToken, res);

    if (!body || !body.id || !body.name) {
      res.status(400);
      res.end(JSON.stringify({ err: "hospital id and name must be present" }));
      return;
    }

    const retrieveHospitalById = container.getRetrieveFacilityById();

    const existingHospital = retrieveHospitalById(
      body.id,
      trustAdminToken.trustId
    );

    if (existingHospital.error) {
      res.status(404);
      res.end(
        JSON.stringify({ err: "hospital does not exist in current trust" })
      );
      return;
    }

    const updateHospital = container.getUpdateFacility();

    const { id, error } = await updateHospital({
      id: body.id,
      name: body.name,
      status: body.status,
      code: body.code,
      surveyUrl: body.surveyUrl,
      supportUrl: body.supportUrl,
    });

    if (error) {
      res.status(500);
      res.end(JSON.stringify({ error: "failed to update hospital" }));
    } else {
      res.status(200);
      res.end(JSON.stringify({ hospitalId: id }));
    }
  }
);
