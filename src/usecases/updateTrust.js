import { VIDEO_PROVIDERS } from "../providers/CallIdProvider";

const updateTrust = ({ getUpdateTrustGateway }) => async ({
  trustId,
  videoProvider,
}) => {
  if (!trustId) {
    return {
      id: null,
      error: "An id must be provided.",
    };
  }
  if (!VIDEO_PROVIDERS.includes(videoProvider)) {
    return {
      id: null,
      error: `${videoProvider} is not a supported video provider.`,
    };
  }

  const { id, error } = await getUpdateTrustGateway()({
    id: trustId,
    videoProvider,
  });

  return {
    id: id,
    error: error,
  };
};

export default updateTrust;
