import { VIDEO_PROVIDERS } from "../../src/providers/CallIdProvider";
import withContainer from "../../src/middleware/withContainer";
import {
  validateHttpMethod,
  checkIfAuthorised,
} from "../../src/helpers/apiErrorHandler";

export default withContainer(async (req, res, { container }) => {
  validateHttpMethod("PATCH", req.method, res);

  const adminIsAuthenticated = container.getAdminIsAuthenticated();

  const token = adminIsAuthenticated(req.headers.cookie);

  checkIfAuthorised(token, res);

  const { id, videoProvider } = req.body;

  if (!id || !Number.isInteger(id)) {
    return res.status(400).end();
  }

  if (!VIDEO_PROVIDERS.includes(videoProvider)) {
    return res.status(400).end();
  }

  const updateTrust = container.getUpdateTrust();

  const { id: updateTrustId, error } = await updateTrust({ id, videoProvider });

  if (!updateTrustId && !error) {
    return res.status(404).end();
  }

  return res.status(200).end();
});
