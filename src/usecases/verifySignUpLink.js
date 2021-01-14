export default ({ getTokenProvider }) => async (token) => {
  const tokenProvider = getTokenProvider();

  const { decryptedToken, errorToken } = tokenProvider.verifyTokenFromLink(
    token
  );

  let error = null;
  if (errorToken) {
    error = "Link is incorrect or expired. Please sign up again";
  }
  return {
    email: decryptedToken ? decryptedToken.emailAddress : "",
    error,
  };
};
