const activateManager = ({ getActivateManagerGateway }) => async ({
  userId,
}) => {
  if (!userId) {
    return {
      user: null,
      error: "userId is not defined",
    };
  }

  const { user, error } = await getActivateManagerGateway()({
    userId,
    verified: true,
    status: 1,
  });

  return { user, error };
};

export default activateManager;
