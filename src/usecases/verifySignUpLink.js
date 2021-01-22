const verifySignUpLink = ({
  getTokenProvider,
  getVerifySignUpLinkGateway,
}) => async (token) => {
  const tokenProvider = getTokenProvider();
  const { decryptedToken, errorToken } = tokenProvider.verifyTokenFromLink(
    token
  );

  if (errorToken) {
    return {
      user: null,
      error: "Link is incorrect or expired. Please sign up again",
    };
  }

  const hash = decryptedToken.hash;
  const uuid = decryptedToken.uuid;

  const { user, error } = await getVerifySignUpLinkGateway()({ hash, uuid });

  if (user.verified || user.status !== 0) {
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

export default verifySignUpLink;
