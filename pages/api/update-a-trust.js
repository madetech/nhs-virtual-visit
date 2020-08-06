import { VIDEO_PROVIDERS } from "../../src/providers/CallIdProvider";
import withContainer from "../../src/middleware/withContainer";

export default withContainer(async (req, res, container) => {
  if (req.method !== "PATCH") {
    res.status(405).end();
    return;
  }

  const adminIsAuthenticated = container.getAdminIsAuthenticated();

  const token = adminIsAuthenticated(req.headers.cookie);

  if (!token) {
    return res.status(401).end();
  }

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
