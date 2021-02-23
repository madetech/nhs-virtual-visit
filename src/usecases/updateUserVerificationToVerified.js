const updateUserVerificationToVerified = ({
  getUpdateUserVerificationToVerifiedGateway
}) => async ({ userId }) => {
  if (!userId) {
    return {
      success: false,
      error: "userId is not defined",
    };
  }

  const updateVerifiedUserVerificationToVerifiedGateway = getUpdateUserVerificationToVerifiedGateway();
  const { 
    success, 
    error, 
  } = await updateVerifiedUserVerificationToVerifiedGateway({
    userId,
    verified: true,
  });
  
  return { success, error };
};

export default updateUserVerificationToVerified;
