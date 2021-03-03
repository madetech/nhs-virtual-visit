const retrieveUserVerificationByUserId = ({
  getRetrieveUserVerificationByUserIdGateway,
}) => async ( userId ) => {
  if (!userId) {
    return {
      verifyUser: null,
      error: "userId is not defined",
    };
  }

  const retrieveUserVerificationByUserIdGateway = getRetrieveUserVerificationByUserIdGateway();
  const { verifyUser, error } = await retrieveUserVerificationByUserIdGateway(userId);

  return { verifyUser, error };
}

export default retrieveUserVerificationByUserId;
