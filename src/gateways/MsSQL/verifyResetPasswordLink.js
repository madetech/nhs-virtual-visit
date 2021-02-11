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
  console.log("*****EMAIL ADDRESS****");
  console.log(emailAddress);

  const { hashedPassword } = await retrieveEmailAndHashedPassword(emailAddress);
  console.log("*****HASHED PASSWORD****");
  console.log(hashedPassword);
  console.log("*****token****");
  console.log(token);
  const { decryptedToken, errorToken } = tokenProvider.verifyTokenFromLink(
    token,
    hashedPassword
  );
  console.log("*****DECRYPTED TOKEN****");
  console.log(decryptedToken);
  let error = null;
  if (errorToken) {
    error = "Link is incorrect or expired. Please reset password again";
  }
  return {
    email: decryptedToken ? decryptedToken.emailAddress : "",
    error,
  };
};
