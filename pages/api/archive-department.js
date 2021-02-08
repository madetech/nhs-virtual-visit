import withContainer from "../../src/middleware/withContainer";
import {
  validateHttpMethod,
  checkIfAuthorised,
} from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("DELETE", method, res);
    const trustAdminIsAuthenticated = container.getOrganisationAdminIsAuthenticated();
    const trustAdminAuthenticatedToken = trustAdminIsAuthenticated(
      headers.cookie
    );
    checkIfAuthorised(trustAdminAuthenticatedToken, res);

    if (!body?.uuid) {
      res.status(400);
      res.end(JSON.stringify({ error: "department uuid must be present" }));
      return;
    }
    res.setHeader("Content-Type", "application/json");

    try {
      const { uuid } = body;
      const {
        department,
        error,
      } = await container.getRetrieveDepartmentByUuid()(uuid);
      if (error) {
        res.status(404);
        res.end(
          JSON.stringify({
            error: "department does not exist in current facility",
          })
        );
        return;
      }
      const {
        uuid: archivedUuid,
        error: archiveError,
      } = await container.getArchiveDepartmentById()(department.id);
      if (archiveError) {
        res.status(400);
        res.end(JSON.stringify("Error on deleting department"));
      } else {
        res.status(200);
        res.end(JSON.stringify({ uuid: archivedUuid }));
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
