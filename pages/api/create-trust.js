import withContainer from "../../src/middleware/withContainer";
import {
  validateHttpMethod,
  checkIfAuthorised,
} from "../../src/helpers/apiErrorHandler";

export default withContainer(
  async ({ headers, body, method }, res, { container }) => {
    validateHttpMethod("POST", method, res);

    const adminIsAuthenticated = container.getAdminIsAuthenticated();

    checkIfAuthorised(adminIsAuthenticated(headers.cookie), res);

    if (!body.name) {
      res.status(409);
      res.end(JSON.stringify({ err: "name must be present" }));
      return;
    }

    if (!body.adminCode) {
      res.status(409);
      res.end(JSON.stringify({ err: "admin code must be present" }));
      return;
    }

    if (!body.password) {
      res.status(409);
      res.end(JSON.stringify({ err: "password must be present" }));
      return;
    }

    if (!body.videoProvider) {
      res.status(409);
      res.end(JSON.stringify({ err: "video provider must be present" }));
      return;
    }

    res.setHeader("Content-Type", "application/json");

    const createTrust = container.getCreateTrust();

    const { trustId, error } = await createTrust({
      name: body.name,
      adminCode: body.adminCode,
      password: body.password,
      videoProvider: body.videoProvider,
    });

    if (error) {
      res.status(409);
      res.end(JSON.stringify({ err: "Admin code already exists" }));
    } else {
      res.status(201);
      res.end(JSON.stringify({ trustId: trustId }));
    }
  }
);
