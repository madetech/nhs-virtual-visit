export default ({ getTokenProvider }) => async (token) => {
  if (token) {
    const tokenProvider = getTokenProvider();
    // const { emailAddress } = tokenProvider.retrieveEmailFromToken(token)
    // if (!email)
    // const { emailAddress, hashedPassword } = retrieveEmailAndHashedPassword(emailAddress);
    // tokenProvider.verifyTokenNotUsed(hashedPassword)
    const { emailAddress } = await tokenProvider.verifyTokenAndRetrieveEmail(
      token
    );
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
