const updateManager = ({ getUpdateManagerStatusGateway }) => async ({
  id,
  status,
}) => {
  try {
    const user = await getUpdateManagerStatusGateway()(id, status);
    return { user, error: null };
  } catch (error) {
    return { user: null, error: "There was an error updating an manager." };
  }
};

export default updateManager;
