const verifyTimeSensitiveLink = ({
  getTokenProvider,
  getVerifyTimeSensitiveLinkGateway,
}) => async (token) => {
  if (!token) {
    return {
      user: null,
      error: "token is not defined",
    };
  }

  const tokenProvider = getTokenProvider();
  const { decryptedToken, errorToken } = tokenProvider.verifyTokenFromLink(
    token
  );

  if (errorToken) {
    return {
      user: null,
      error: "Link is incorrect or expired.",
    };
  }

  const hash = decryptedToken.hash;
  const uuid = decryptedToken.uuid;

  const verifyTimeSensitiveLinkGateway = getVerifyTimeSensitiveLinkGateway();
  const { user, error } = await verifyTimeSensitiveLinkGateway({ hash, uuid });

  if (user && (user.verified || (user.type !== "resetPassword" && user.status !== 0))) {
    let errorMessage;
    user.verified
      ? (errorMessage = "Link is invalid. Please sign up again")
      : (errorMessage = "User account has been activated");

    return {
      user: null,
      error: errorMessage,
    };
  }

  return { user, error };
};

export default verifyTimeSensitiveLink;
