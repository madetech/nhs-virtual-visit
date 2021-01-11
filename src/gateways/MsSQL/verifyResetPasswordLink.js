<<<<<<< HEAD
import retrieveEmailAndHashedPassword from "./retrieveEmailAndHashedPassword";

export default ({ getTokenProvider }) => async (token) => {
  const tokenProvider = getTokenProvider();
  const { emailAddress } = tokenProvider.retrieveEmailFromToken(token);

  if (!emailAddress) {
=======
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

>>>>>>> chore: refactor token provider for reset password
    return {
      email: "",
      error: "Email address does not exist",
    };
  }

  const { hashedPassword } = await retrieveEmailAndHashedPassword(emailAddress);

  const { errorToken } = tokenProvider.verifyTokenNotUsed(
    token,
    hashedPassword
  );

  return {
    email: errorToken ? "" : emailAddress,
    error: errorToken,
  };
};
