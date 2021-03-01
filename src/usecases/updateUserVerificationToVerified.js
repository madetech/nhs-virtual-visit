const updateUserVerificationToVerified = ({
  getUpdateUserVerificationToVerifiedGateway
}) => async ({ hash }) => {
  if (!hash) {
    return {
      success: false,
      error: "hash is not defined",
    };
  }

  const updateVerifiedUserVerificationToVerifiedGateway = getUpdateUserVerificationToVerifiedGateway();
  const { 
    success, 
    error, 
  } = await updateVerifiedUserVerificationToVerifiedGateway({
    hash,
    verified: true,
  });
  
  return { success, error };
};

export default updateUserVerificationToVerified;
