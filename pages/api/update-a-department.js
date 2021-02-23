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

    if (!body || !body.uuid || !body.name) {
      res.status(400);
      res.end(
        JSON.stringify({
          error: "uuid and name must be present",
        })
      );
      return;
    }
    try {
      const { uuid, name } = body;
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
      let args = {
        id: department.id,
        name,
      }
      if (body.pin) {
        args = { ...args, pin: body.pin}
      }
      const {
        uuid: departmentUuid,
        error,
      } = await container.getUpdateDepartmentById()(args);

      if (error) {
        res.status(400);
        res.end(JSON.stringify({ error }));
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
