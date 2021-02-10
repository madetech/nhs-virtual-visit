export default ({
  getTokenProvider,
  getRetrieveEmailAndHashedPasswordGateway,
}) => async (token) => {
  const tokenProvider = getTokenProvider();
  const { emailAddress } = tokenProvider.retrieveEmailFromToken(token);

  if (!emailAddress) {
    return {
      email: "",
      error: "Email address does not exist",
    };
  }
  const {
    user: { hashedPassword },
  } = await getRetrieveEmailAndHashedPasswordGateway()({ email: emailAddress });
  const { decryptedToken, errorToken } = tokenProvider.verifyTokenFromLink(
    token,
    hashedPassword
  );
  let error = null;
  if (errorToken) {
    error = "Link is incorrect or expired. Please reset password again";
  }
  return {
    email: decryptedToken ? decryptedToken.emailAddress : "",
    error,
  };
};
