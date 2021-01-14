const updateManager = ({
  getMsSqlConnPool,
  getUpdateManagerStatusGateway,
}) => async ({ email, status }) => {
  try {
    const db = await getMsSqlConnPool();
    const user = await getUpdateManagerStatusGateway()(db, email, status);
    return { user, error: null };
  } catch (error) {
    return { user: null, error: "There was an error updating an manager." };
  }
};

export default updateManager;
