export default ({ getRetrieveEmailAndHashedPasswordGateway }) => async (
  email
) => {
  if (!email) {
    return {
      emailAddress: "",
      hashedPassword: "",
      error: "email is not defined",
    };
  }
  const { user, error } = await getRetrieveEmailAndHashedPasswordGateway()({
    email,
  });
  return {
    emailAddress: user?.emailAddress,
    hashedPassword: user?.hashedPassword,
    error,
  };
};
