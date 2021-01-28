const retrieveManagerByEmail = ({ getRetrieveManagerByEmailGateway }) => async (
  email
) => {
  if (!email) {
    return {
      manager: null,
      error: "email is not defined",
    };
  }

  const { manager, error } = await getRetrieveManagerByEmailGateway()(email);

  return { manager, error };
};

export default retrieveManagerByEmail;
