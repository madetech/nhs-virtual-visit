import retrieveEmailAndHashedPassword from "./retrieveEmailAndHashedPassword";

export default ({ getTokenProvider }) => async (token) => {
  const tokenProvider = getTokenProvider();
  const { emailAddress } = tokenProvider.retrieveEmailFromToken(token);

  if (!emailAddress) {
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
