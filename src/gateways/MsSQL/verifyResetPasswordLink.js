export default ({ getTokenProvider }) => (token) => {
  if (token) {
    const tokenProvider = getTokenProvider();
    const { emailAddress } = tokenProvider.verifyTokenAndRetrieveEmail(token);
    let error = null;
    if (!emailAddress) {
      error =
        "Link is incorrect or has expired. Please reset your password again to get a new link.";
    }
    return {
      email: emailAddress,
      error,
    };
  }
};
