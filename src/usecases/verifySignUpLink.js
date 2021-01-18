export default ({ getTokenProvider }) => async (token) => {
  const tokenProvider = getTokenProvider();

  const { decryptedToken, errorToken } = tokenProvider.verifyTokenFromLink(
    token
  );

  console.log(decryptedToken);
  let error = null;
  if (errorToken) {
    error = "Link is incorrect or expired. Please sign up again";
  }
  return {
    id: decryptedToken ? decryptedToken.id : "",
    error,
  };
};
