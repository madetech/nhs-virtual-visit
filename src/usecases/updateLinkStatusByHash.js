const updateLinkStatusByHash = ({
  getUpdateLinkStatusByHashGateway,
}) => async ({ hash }) => {
  if (!hash) {
    return {
      userVerification: null,
      error: "hash is not defined",
    };
  }

  const { userVerification, error } = await getUpdateLinkStatusByHashGateway()({
    hash,
    verified: true,
  });

  return { userVerification, error };
};

export default updateLinkStatusByHash;
