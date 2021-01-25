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
    if (!body || !uuid || !name || !status) {
      res.status(400);
      res.end(
        JSON.stringify({
          error: "uuid, name and department status must be present",
        })
      );
      return;
    }
    try {
      const {
        department,
        error: departmentError,
      } = await container.getRetrieveDepartmentByUuid()(uuid);

      if (departmentError) {
        res.status(400);
        res.end(
          JSON.stringify({
            error: "department does not exist in current trust",
          })
        );
        return;
      }

      const {
        uuid: departmentUuid,
        error,
      } = await container.getUpdateDepartmentById()({
        id: department.id,
        name,
        status,
      });

      if (error) {
        res.status(400);
        res.end();
      } else {
        res.status(201);
        res.end(JSON.stringify({ uuid: departmentUuid }));
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
